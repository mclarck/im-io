export default class User {
  knex: any;
  OPTIONS = {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: () => ({
      filename: process.env.DATABASE_URL,
    }),
  };
  constructor() {
    this.knex = require("knex")(this.OPTIONS);
    this.create()
      .then(() => {
        console.log("user table is ready");
      })
      .catch((e) => this.onError(e));
  }
  onError(error: any) {
    if (error) console.log(error.message);
  }
  async create() {
    try {
      if (!(await this.knex.schema.hasTable("users"))) {
        await this.knex.schema.createTable("users", function (t: any) {
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
    } catch (error) {
      this.onError(error);
    }
  }
  async persist(data: any[]) {
    try {
      await this.knex("users").where("sid", null).del();
      if (data[0]?.sid) {
        return await this.knex("users").insert(data).where("sid", data[0]?.sid);
      }
    } catch (error) {
      this.onError(error);
    }
  }
  async findAll() {
    try {
      return await this.knex.select("*").from("users");
    } catch (error) {
      this.onError(error);
    }
  }
  async removeBySid(sid: any) {
    try {
      return await this.knex("users").where("sid", sid).del();
    } catch (error) {
      this.onError(error);
    }
  }
  async findBySid(sid: any) {
    try {
      return await this.knex.select("*").from("users").where("sid", sid);
    } catch (error) {
      this.onError(error);
    }
  }
}
