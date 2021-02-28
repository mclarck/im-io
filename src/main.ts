const dotenv = require("dotenv");
dotenv.config();
import * as express from "express";
import * as path from "path";
import Chat from "./chat";
import Order from "./order";
const app = express();
const http = require("http");
const server = http.Server(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
  transports: ["polling"],
});

app.get("/chat", (req, res) => {
  res.sendFile(path.resolve("./public/chat.html"));
});
app.get("/order", (req, res) => {
  res.sendFile(path.resolve("./public/order.html"));
});

const chat = io.of("/chat");
const chat_users: Array<any> = new Array();

chat.on("connect", (socket: any) => {
  const chatMan = new Chat(chat, chat_users, socket);
  chatMan.exec();
});

const order = io.of("/order");

order.on("connect", (socket: any) => {
  const orderMan = new Order(order, null, socket);
  orderMan.exec();
});

server.listen(process.env.PORT, () => {
  console.log("server is running on port: " + process.env.PORT);
});
