"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
class Chat {
    constructor(scope, socket) {
        this.NEW_MESSAGE = "message";
        this.MESSAGE = "message";
        this.JOIN_ROOM = "join";
        this.LEAVE_ROOM = "leave";
        this.JOINED_ROOM = "joined";
        this.LEFT_ROOM = "left";
        this.ONLINES = "onlines";
        this.socket = socket;
        this.scope = scope;
        this.users = new user_1.default();
    }
    onNewMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof payload == "object") {
                const dest = payload === null || payload === void 0 ? void 0 : payload.dest;
                console.log(dest, "new message");
                if (dest) {
                    this.scope.to(dest === null || dest === void 0 ? void 0 : dest.iri).emit(this.MESSAGE, payload);
                    this.socket.emit(this.MESSAGE, payload);
                }
                this.scope.emit(this.ONLINES, this.users.findAll());
            }
        });
    }
    onJoinRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof payload == "object") {
                const data = [
                    {
                        sid: this.socket.id,
                        iri: payload === null || payload === void 0 ? void 0 : payload.iri,
                        _id: payload === null || payload === void 0 ? void 0 : payload._id,
                        email: payload === null || payload === void 0 ? void 0 : payload.email,
                        username: payload === null || payload === void 0 ? void 0 : payload.username,
                        phone: payload === null || payload === void 0 ? void 0 : payload.phone,
                        status: payload === null || payload === void 0 ? void 0 : payload.status,
                    },
                ];
                this.users.persist(data);
                this.socket.join(data === null || data === void 0 ? void 0 : data.iri);
                this.scope.emit(this.JOINED_ROOM, data);
                this.scope.emit(this.ONLINES, this.users.findAll());
            }
        });
    }
    onLeaveRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.leave(payload === null || payload === void 0 ? void 0 : payload.room);
            this.scope.emit(this.LEFT_ROOM, payload);
            this.scope.emit(this.ONLINES, this.users.findAll());
        });
    }
    onDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.users.removeBySid(this.socket.id);
            console.log(this.socket.id, "socket disconnected");
            console.log(yield this.users.findAll(), "socket disconnected");
            this.scope.emit("onlines", this.users.findAll());
        });
    }
    exec() {
        this.socket.on(this.NEW_MESSAGE, (payload) => this.onNewMessage(payload));
        this.socket.on(this.JOIN_ROOM, (payload) => this.onJoinRoom(payload));
        this.socket.on(this.LEAVE_ROOM, (payload) => this.onLeaveRoom(payload));
        this.socket.on("disconnect", () => this.onDisconnect());
    }
}
exports.default = Chat;
