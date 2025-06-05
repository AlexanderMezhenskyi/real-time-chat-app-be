import express from "express"
import http from "http"
import { Server } from "socket.io"
import { handleRpc } from "./rpc.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

const PORT = process.env.PORT || 4000

io.on("connection", (socket) => {
  console.log("Client connected", socket.id)
  handleRpc(socket)

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
