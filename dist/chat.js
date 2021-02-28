"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chat {
    constructor(scope, users, socket) {
        this.NEW_MESSAGE = "message";
        this.MESSAGE = "message";
        this.JOIN_ROOM = "join";
        this.LEAVE_ROOM = "leave";
        this.JOINED_ROOM = "joined";
        this.LEFT_ROOM = "left";
        this.ONLINES = "onlines";
        this.socket = socket;
        this.scope = scope;
        this.users = users;
    }
    setUser(data) {
        const buf = this.users;
        buf[data === null || data === void 0 ? void 0 : data.sid] = data;
        this.users = buf;
        return buf;
    }
    getCurrentUser() {
        var _a;
        const sid = (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id;
        const buf = this.users;
        return buf[sid];
    }
    removeCurrentUser() {
        var _a;
        const sid = (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id;
        const buf = this.users;
        if (buf[sid])
            delete buf[sid];
        return buf;
    }
    onNewMessage(payload) {
        if (typeof payload == "object") {
            const dest = payload === null || payload === void 0 ? void 0 : payload.dest;
            console.log(dest);
            if (dest) {
                this.scope.to(dest === null || dest === void 0 ? void 0 : dest.iri).emit(this.MESSAGE, payload);
            }
            this.scope.emit(this.ONLINES, Object.values(this.users));
        }
    }
    onJoinRoom(payload) {
        var _a;
        if (typeof payload == "object") {
            const data = Object.assign(Object.assign({}, payload), { sid: (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id, iri: payload === null || payload === void 0 ? void 0 : payload.iri, rooms: this.socket.rooms });
            this.setUser(data);
            this.socket.join(data === null || data === void 0 ? void 0 : data.iri);
            this.scope.emit(this.JOINED_ROOM, data);
            this.scope.emit(this.ONLINES, Object.values(this.users));
        }
    }
    onLeaveRoom(payload) {
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
exports.default = Chat;
