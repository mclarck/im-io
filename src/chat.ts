import * as SocketIO from "socket.io";
import User from "./user";

export default class Chat {
  socket: SocketIO.Socket;
  scope: SocketIO.Namespace;
  users: User;

  NEW_MESSAGE = "message";
  MESSAGE = "message";
  JOIN_ROOM = "join";
  LEAVE_ROOM = "leave";
  JOINED_ROOM = "joined";
  LEFT_ROOM = "left";
  ONLINES = "onlines";

  constructor(scope: SocketIO.Namespace, socket: SocketIO.Socket) {
    this.socket = socket;
    this.scope = scope;
    this.users = new User();
    this.onConnect()
      .then(() => {
        console.log("new client connected");
      })
      .catch((e) => {
        this.onError(e);
      });
  }

  onError(error: any) {
    console.log(error.message);
  }

  async onConnect() {
    this.scope.emit(this.ONLINES, await this.users.findAll());
  }

  async onNewMessage(payload: any) {
    if (typeof payload == "object") {
      const dest = payload?.dest;
      console.log(dest, "new message");
      if (dest) {
        this.scope.to(dest?.iri).emit(this.MESSAGE, payload);
        this.socket.emit(this.MESSAGE, payload);
      }
      this.scope.emit(this.ONLINES, await this.users.findAll());
    }
  }

  async onJoinRoom(payload: any) {
    if (typeof payload == "object") {
      const data: any = [
        {
          sid: this.socket.id,
          iri: payload?.iri,
          _id: payload?._id,
          email: payload?.email,
          username: payload?.username,
          phone: payload?.phone,
          status: payload?.status,
        },
      ];
      await this.users.persist(data);
      this.socket.join(data?.iri);
      this.scope.emit(this.JOINED_ROOM, data);
      this.scope.emit(this.ONLINES, await this.users.findAll());
    }
  }

  async onLeaveRoom(payload?: any) {
    this.socket.leave(payload?.room);
    this.scope.emit(this.LEFT_ROOM, payload);
    this.scope.emit(this.ONLINES, await this.users.findAll());
  }

  async onDisconnect() {
    await this.users.removeBySid(this.socket.id);
    console.log(this.socket.id, "socket disconnected");
    console.log(await this.users.findAll(), "socket disconnected");
    this.scope.emit("onlines", await this.users.findAll());
  }

  exec() {
    this.socket.on(this.NEW_MESSAGE, (payload) => this.onNewMessage(payload));
    this.socket.on(this.JOIN_ROOM, (payload) => this.onJoinRoom(payload));
    this.socket.on(this.LEAVE_ROOM, (payload) => this.onLeaveRoom(payload));
    this.socket.on("disconnect", () => this.onDisconnect());
  }
}
