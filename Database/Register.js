const mysql2 = require("mysql2/promise")

async function Register(name, password, res){
    const Conn = await mysql2.createConnection({
        host:"127.0.0.1",
        user:"root",
        password:"multilaser123",
        database:"shareapp"
    })
    try{
        var [colums, fields] = await Conn.execute(`select * from users where name = '${name}';`)
        if(colums.length > 0){
            res.send("Your username already exists in database!")
        }else{
            var [InsertAccount, bruh] = await Conn.execute(`insert into users (name, password) values ("${name}", "${password}");`)
            res.send("Your account was executed with success!")
        }
    }catch(Error){
        res.send("Happened a error in database server!")
        console.log(Error)
    }
    Conn.end()
    
}

module.exports = Register


