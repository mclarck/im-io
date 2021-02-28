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
    this.users.push(data);
    // console.log(data, "new user added");
  }

  getCurrentUser() {
    let user: any;
    const sid: any = this.socket?.id;
    this.users.map((o) => {
      if (o.sid === sid) user = o;
    });
    return user;
  }

  removeCurrentUser() {
    const sid: any = this.socket?.id;
    let curr: any;
    const buf = this.users.filter((o) => {
      if (o.sid === sid) {
        curr = o;
        return false;
      }
    });
    console.log(buf, "user removed");
    this.users = buf;
  }

  onNewMessage(payload: any) {
    if (typeof payload == "object") {
      const dest = payload?.dest;
      console.log(dest, "new message");
      if (dest) {
        this.scope.to(dest?.iri).emit(this.MESSAGE, payload);
        this.socket.emit(this.MESSAGE, payload);
      }
      this.scope.emit(this.ONLINES, this.users);
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
      this.scope.emit(this.ONLINES, this.users);
    }
  }

  onLeaveRoom(payload?: any) {
    this.socket.leave(payload?.room);
    this.scope.emit(this.LEFT_ROOM, payload);
    this.scope.emit(this.ONLINES, this.users);
  }

  onDisconnect() {
    this.removeCurrentUser();
    console.log(this.socket.id, "socket disconnected");
    console.log(this.users, "socket disconnected");
    this.scope.emit("onlines", this.users);
  }

  exec() {
    this.socket.on(this.NEW_MESSAGE, (payload) => this.onNewMessage(payload));
    this.socket.on(this.JOIN_ROOM, (payload) => this.onJoinRoom(payload));
    this.socket.on(this.LEAVE_ROOM, (payload) => this.onLeaveRoom(payload));
    this.socket.on("disconnect", () => this.onDisconnect());
  }
}
