import * as SocketIO from "socket.io";

export default class Order {
  socket: SocketIO.Socket;
  scope: SocketIO.Namespace;
  users: Array<any>;

  NEW_ORDER = "order";
  ORDER = "order";
  STATUS = "status";

  constructor(
    scope: SocketIO.Namespace,
    users: Array<any>,
    socket: SocketIO.Socket
  ) {
    this.socket = socket;
    this.scope = scope;
    this.users = users;
  }

  onNewOrder(payload: any) {
    this.scope.emit(this.ORDER, payload);
  }

  onNewStatus(payload: any) {
    this.scope.emit(this.STATUS, payload);
  }

  exec() {
    this.socket.on(this.NEW_ORDER, (payload) => this.onNewOrder(payload));
    this.socket.on(this.STATUS, (payload) => this.onNewStatus(payload));
  }
}
