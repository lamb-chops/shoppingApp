const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt)

class UsersRepository extends Repository {
    async create(attrs) {
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex')
            //scrypt turned from call back to promise with promisfy function
        const buf = await scrypt(attrs.password, salt, 64)
        const records = await this.getAll();
        const record = {...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        await this.writeAll(records);

        return record;
    }

    //saved is pass saved in DB, supplied is pass given by user signing in
    async comparePasswords(saved, supplied) {
        //also written as const [hashed, salt] = saved.split('.')
        const result = saved.split('.') //splitting on . seperates pass from salt
        const hashed = result[0]
        const salt = result[1]
            //num after salt param must match one used in create
            //scrypt returns buffer
        const hashedBuff = await scrypt(supplied, salt, 64)

        return hashed === hashedBuff.toString('hex')
    }
}
//recieve instance of class instead of just passing class then instantiating when called
//works cuz only need one
module.exports = new UsersRepository("users.json");