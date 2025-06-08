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

const PORT = process.env.PORT || 3000

io.on("connection", (socket) => {
  console.log("Client connected", socket.id)
  handleRpc(socket, io)

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id)
  })
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
})

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason)
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
