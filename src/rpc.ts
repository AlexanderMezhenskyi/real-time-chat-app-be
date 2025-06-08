import { Socket, Server } from "socket.io"

type JsonRpcRequest = {
  jsonrpc: "2.0"
  method: string
  params?: Record<string, unknown>
  id?: string | number | null
}

type JsonRpcResponse =
  | {
      jsonrpc: "2.0"
      result: unknown
      id: string | number | null
    }
  | {
      jsonrpc: "2.0"
      error: { code: number; message: string }
      id: string | number | null
    }

const isJsonRpcRequest = (obj: any): obj is JsonRpcRequest => {
  return (
    obj &&
    obj.jsonrpc === "2.0" &&
    typeof obj.method === "string" &&
    (obj.id === undefined ||
      typeof obj.id === "string" ||
      typeof obj.id === "number" ||
      obj.id === null)
  )
}

const userRooms = new Map<string, string>()

export const handleRpc = (socket: Socket, io: Server) => {
  socket.on("rpc", (req: unknown) => {
    try {
      if (!isJsonRpcRequest(req)) {
        const error: JsonRpcResponse = {
          jsonrpc: "2.0",
          error: { code: -32600, message: "Invalid Request" },
          id: null,
        }
        socket.emit("rpc", error)
        return
      }

      const { method, params, id } = req

      if (method === "joinRoom") {
        const room = params?.room
        const username = params?.username

        if (typeof room !== "string" || typeof username !== "string") {
          socket.emit("rpc", {
            jsonrpc: "2.0",
            error: { code: -32602, message: "Invalid room or username param" },
            id,
          })

          return
        }

        const previousRoom = userRooms.get(socket.id)
        socket.data.username = username

        if (previousRoom && previousRoom !== room) {
          socket.leave(previousRoom)
          userRooms.delete(socket.id)

          const usersInOldRoom = Array.from(userRooms.entries())
            .filter(([_, r]) => r === previousRoom)
            .map(([id]) => io.sockets.sockets.get(id)?.data.username ?? id)

          io.to(previousRoom).emit("rpc", {
            jsonrpc: "2.0",
            method: "activeUsers",
            params: { room: previousRoom, users: usersInOldRoom },
          })
        }

        socket.join(room)
        userRooms.set(socket.id, room)

        const usersInNewRoom = Array.from(userRooms.entries())
          .filter(([_, r]) => r === room)
          .map(([id]) => io.sockets.sockets.get(id)?.data.username ?? id)

        io.to(room).emit("rpc", {
          jsonrpc: "2.0",
          method: "activeUsers",
          params: { room, users: usersInNewRoom },
        })

        socket.emit("rpc", {
          jsonrpc: "2.0",
          result: `Joined room: ${room}`,
          id,
        })
        return
      }

      if (method === "message") {
        const message = params?.message
        const username = params?.username
        const room = params?.room

        if (typeof message !== "string" || typeof username !== "string") {
          socket.emit("rpc", {
            jsonrpc: "2.0",
            error: { code: -32602, message: "Invalid params" },
            id,
          })
          return
        }

        const response = {
          id: Date.now().toString(),
          content: message,
          author: username,
          timestamp: Date.now(),
          room: typeof room === "string" ? room : null,
        }

        if (typeof room === "string") {
          io.to(room).emit("rpc", {
            jsonrpc: "2.0",
            method: "message",
            params: response,
          })
        } else {
          io.emit("rpc", {
            jsonrpc: "2.0",
            method: "message",
            params: response,
          })
        }

        socket.emit("rpc", {
          jsonrpc: "2.0",
          result: "ok",
          id,
        })
        return
      }

      socket.emit("rpc", {
        jsonrpc: "2.0",
        error: { code: -32601, message: "Method not found" },
        id,
      })
    } catch (err) {
      console.error("Error in RPC handler:", err)
      socket.emit("rpc", {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Internal server error" },
        id: null,
      })
    }
  })

  socket.on("disconnect", () => {
    const previousRoom = userRooms.get(socket.id)

    if (previousRoom) {
      userRooms.delete(socket.id)

      const usersInRoom = Array.from(userRooms.entries())
        .filter(([_, r]) => r === previousRoom)
        .map(([id]) => io.sockets.sockets.get(id)?.data.username ?? id)

      io.to(previousRoom).emit("rpc", {
        jsonrpc: "2.0",
        method: "activeUsers",
        params: { room: previousRoom, users: usersInRoom },
      })
    }
  })
}

