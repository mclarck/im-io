import * as SocketIO from "socket.io";

export default class Chat {
  socket: SocketIO.Socket;
  scope: SocketIO.Namespace;
  users: Array<any>;

  NEW_MESSAGE = "message";
  MESSAGE = "message";
  JOIN_ROOM = "join";
  LEAVE_ROOM = "leave";
  JOINED_ROOM = "joined";
  LEFT_ROOM = "left";
  ONLINES = "onlines";

  constructor(
    scope: SocketIO.Namespace,
    users: Array<any>,
    socket: SocketIO.Socket
  ) {
    this.socket = socket;
    this.scope = scope;
    this.users = users;
  }

  setUser(data: any) {
    const buf = this.users;
    buf[data?.sid] = data;
    this.users = buf;
    return buf;
  }

  getCurrentUser() {
    const sid: any = this.socket?.id;
    const buf = this.users;
    return buf[sid];
  }

  removeCurrentUser() {
    const sid: any = this.socket?.id;
    const buf = this.users;
    if (buf[sid]) delete buf[sid];
    return buf;
  }

  onNewMessage(payload: any) {
    if (typeof payload == "object") {
      const dest = payload?.dest;
      console.log(dest,"new message");
      if (dest) {
        this.scope.to(dest?.iri).emit(this.MESSAGE, payload);
        this.socket.emit(this.MESSAGE, payload);
      }
      this.scope.emit(this.ONLINES, Object.values(this.users));
    }
  }

  onJoinRoom(payload: any) {
    if (typeof payload == "object") {
      const data: any = {
        ...payload,
        sid: this.socket?.id,
        iri: payload?.iri,
        rooms: this.socket.rooms,
      };
      this.setUser(data);
      this.socket.join(data?.iri);
      this.scope.emit(this.JOINED_ROOM, data);
      this.scope.emit(this.ONLINES, Object.values(this.users));
    }
  }

  onLeaveRoom(payload: any) {
    if (typeof payload == "object") {
      this.users = this.removeCurrentUser();
      this.scope.emit(this.LEFT_ROOM, payload);
      this.scope.emit(this.ONLINES, Object.values(this.users));
    }
  }

  exec() {
    this.socket.on(this.NEW_MESSAGE, (payload) => this.onNewMessage(payload));
    this.socket.on(this.JOIN_ROOM, (payload) => this.onJoinRoom(payload));
    this.socket.on(this.LEAVE_ROOM, (payload) => this.onLeaveRoom(payload));
    this.socket.on("disconnect", (payload) => this.onLeaveRoom(payload));
  }
}
