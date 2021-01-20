const mysql2 = require("mysql2/promise")

async function Login(name, password, res){
    const Conn = await mysql2.createConnection({
        host:"127.0.0.1",
        user:"root",
        password:"multilaser123",
        database:"shareapp"
    })
    try{
        var [Login, bruh] = await Conn.execute(`select * from users where name = '${name}' and password = '${password}';`)
        if(Login.length == 1){
            res.send("Access Granted!")
        }else{
            res.send("Account not exists!")
        }
    }catch(Error){
        res.send("Happened a error in database server!")
    }
    Conn.end()
}

module.exports = Login