const { connect } = require("http2")
const mysql2 = require("mysql2/promise")

async function Authentication(Name, res){
    const Conn = await mysql2.createConnection({
        host:"127.0.0.1",
        user:"root",
        password:"multilaser123",
        database:"shareapp"
    })
    var [Users, colums] = await Conn.execute(`select * from users where name = '${Name}'`)
    if(Users.length == 1){
        res.send("User was Found!")
    }else{
        res.send("User not Found!")
    }
    Conn.end()
}

module.exports = Authentication