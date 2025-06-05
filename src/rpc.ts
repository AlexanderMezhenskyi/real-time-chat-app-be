import { Socket } from "socket.io"

type JsonRpcRequest = {
  jsonrpc: "2.0"
  method: string
  params?: Record<string, any>
  id?: string | number | null
}

type JsonRpcResponse = {
  jsonrpc: "2.0"
  result?: any
  error?: {
    code: number
    message: string
  }
  id: string | number | null
}

export function handleRpc(socket: Socket) {
  socket.on("rpc", (req: unknown) => {
    const request = req as JsonRpcRequest

    if (request?.jsonrpc !== "2.0") {
      const error: JsonRpcResponse = {
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid Request" },
        id: null
      }
      socket.emit("rpc", error)
      return
    }

    if (request.method === "message") {
      const message = request.params?.message
      if (typeof message !== "string") {
        socket.emit("rpc", {
          jsonrpc: "2.0",
          error: { code: -32602, message: "Invalid params" },
          id: request.id ?? null
        })
        return
      }

      socket.broadcast.emit("rpc", {
        jsonrpc: "2.0",
        method: "message",
        params: { message },
      })

      socket.emit("rpc", {
        jsonrpc: "2.0",
        result: "ok",
        id: request.id ?? null
      })

    } else {
      socket.emit("rpc", {
        jsonrpc: "2.0",
        error: { code: -32601, message: "Method not found" },
        id: request.id ?? null
      })
    }
  })
}
