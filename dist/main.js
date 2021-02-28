"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const chat_1 = require("./chat");
const order_1 = require("./order");
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
const chat_users = new Array();
chat.on("connect", (socket) => {
    const chatMan = new chat_1.default(chat, chat_users, socket);
    chatMan.exec();
});
const order = io.of("/order");
order.on("connect", (socket) => {
    const orderMan = new order_1.default(order, null, socket);
    orderMan.exec();
});
server.listen(process.env.PORT, () => {
    console.log("server is running on port: " + process.env.PORT);
});
