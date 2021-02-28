"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(scope, users, socket) {
        this.NEW_ORDER = "order";
        this.ORDER = "order";
        this.STATUS = "status";
        this.socket = socket;
        this.scope = scope;
        this.users = users;
    }
    onNewOrder(payload) {
        this.scope.emit(this.ORDER, payload);
    }
    onNewStatus(payload) {
        this.scope.emit(this.STATUS, payload);
    }
    exec() {
        this.socket.on(this.NEW_ORDER, (payload) => this.onNewOrder(payload));
        this.socket.on(this.STATUS, (payload) => this.onNewStatus(payload));
    }
}
exports.default = Order;
