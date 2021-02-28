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
class User {
    constructor() {
        this.OPTIONS = {
            client: "sqlite3",
            useNullAsDefault: true,
            connection: () => ({
                filename: process.env.DATABASE_URL,
            }),
        };
        this.knex = require("knex")(this.OPTIONS);
        this.create()
            .then(() => {
            console.log("user table is ready");
        })
            .catch((e) => this.onError(e));
    }
    onError(error) {
        if (error)
            console.log(error.message);
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(yield this.knex.schema.hasTable("users"))) {
                    yield this.knex.schema.createTable("users", function (t) {
                        t.increments("id").primary();
                        t.string("sid", 255);
                        t.string("iri", 255);
                        t.string("_id", 11);
                        t.string("username", 255);
                        t.string("phone", 255);
                        t.string("email", 255);
                        t.string("status", 255);
                    });
                }
            }
            catch (error) {
                this.onError(error);
            }
        });
    }
    persist(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex("users").where("sid", null).del();
                if ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.sid) {
                    return yield this.knex("users").insert(data).where("sid", (_b = data[0]) === null || _b === void 0 ? void 0 : _b.sid);
                }
            }
            catch (error) {
                this.onError(error);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.knex.select("*").from("users");
            }
            catch (error) {
                this.onError(error);
            }
        });
    }
    removeBySid(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("removing old socket connection", "removeBySid");
                return yield this.knex("users").where("sid", sid).del();
            }
            catch (error) {
                this.onError(error);
            }
        });
    }
    findBySid(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.knex.select("*").from("users").where("sid", sid);
            }
            catch (error) {
                this.onError(error);
            }
        });
    }
}
exports.default = User;
