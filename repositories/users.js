const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a reposity requires a filename.");
    }

    this.filename = filename;
    try {
      //synchronous access, ok cuz we are just running one only once. no call back cuz not async
      fs.accessSync(this.filename);
    } catch (err) {
      //creates file if does not exist, returns empty array so array always inside file
      fs.writeFileSync(this.filename, "[]");
    }
  }
  async getAll() {
    const contents = await fs.promises.readFile(this.filename, {
      encoding: "utf8",
    });
    const data = JSON.parse(contents);
    return data;
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  async writeAll(records) {
    //stringify goes from string to json, null and 2 as params make json more readible instead of one line
    //null is for custom formatter, 2 is level of indentation to use for string and nesting
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    //creates random 4 bytes turned to string for unique ID
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    //find returns first record that meets conditions
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    //filter only returns ones that are true
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} is not found.`);
    }
    //copies all of attrs one by one into record
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    //for of = arrays and iterables
    for (let record of records) {
      let found = true;
      //for in = iter through object, recieve every key in object
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}
//recieve instance of class instead of just passing class then instantiating when called
//works cuz only need one
module.exports = new UsersRepository("users.json");
