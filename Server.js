const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const Register = require("./Database/Register")
const Login = require("./Database/Login")
const expressUpload = require("express-fileupload")
const Authentication = require("./Database/Authentication")


app.use(bodyParser())
app.use(expressUpload({
    createParentPath: true
}))

var ServerAccess = "g84kDmg4kg9eg8vcdsDEFCgh432d6gFug"
var CanTalkWithClient = true

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin" , "*")
    app.use(cors())
    next()
})

app.use((req,res,next) => {
    let URLtoSplit = req.url.split("/")
    if(URLtoSplit[0] == "" && URLtoSplit[1] == "SecurityImages" && URLtoSplit[2] != ""){
        fs.exists(`./${URLtoSplit[1]}/${URLtoSplit[2]}`, (result) => {
            if(result == true){
                res.sendfile(`./${URLtoSplit[1]}/${URLtoSplit[2]}`)
                
            }
            else{
                next()
            }
        })
        
    }else{
        next()
    }
    
})

app.get("/Json", (req,res) => {
    fs.writeFile("./RegisteredUsers/romulo/Ext/Files.json", `"Files": []`, (err) => {

    })
    res.send("opa")
})

app.post("/Security", (req,res) => {
    if(CanTalkWithClient == true){
        if(req.body.Thekeyword == ServerAccess){
            fs.readdir("./SecurityImages", (err, result) => {
                if(err){
                    res.send("Happened a Error")
                    console.log(err)
                }else{
                    let totalFiles = result.length / 2
                    let SelectedFile =  Math.floor(Math.random() * (totalFiles - 1))
                    if(SelectedFile == 0){
                        SelectedFile = 5
                    }
                    fs.readFile("./SecurityImages/security" + SelectedFile + ".txt", 'utf8', (err,resultt) => {
                        if(err){
                            res.send("Happened a Error")
                            console.log(err)
                        }else{
                            let JsonToSend = {
                                "Image" : "/SecurityImages/security" + SelectedFile + ".jpg",
                                "KeyWord" : resultt
                            }
                            res.send(JsonToSend)
                        }
                    })
                }
            })
        }else{
            res.send("Access denied!")
        }
    }
    
})

app.post("/RegisterRoom", (req,res) => {
    let UserName = req.body.UserName
    let UserPassword = req.body.UserPassword
    let UserKey = req.body.UserKey
    let RealKey = req.body.RealKey
    let ServerLicense = req.body.ServerLicense

    if(ServerLicense == ServerAccess){
        if(UserKey == RealKey){
            Register(UserName, UserPassword, res)
            
        }else{
            res.send("User not completed anti-bot test!")
        }
    }else{
        res.send("Access Denied!")
    }
})


app.post("/LoginRoom", (req,res) => {
    let UserName = req.body.UserName
    let Password = req.body.Password
    let ServerPassword = req.body.ServerAccess
    if(ServerPassword == ServerAccess){
        Login(UserName,Password,res)    
    }else{
        res.send("Access Denied!")
    }
})

app.post("/FileUpload" , (req,res) => {
    let Username = req.body.UserName
    let TheFile = req.files.File
    let DisplayMode = req.body.DisplayType
    if(Username != "Unregistered"){
        if(TheFile != null){
            fs.exists(`./RegisteredUsers/${Username}`, (result) => {
                if(result != true){
                    fs.mkdirSync(`./RegisteredUsers/${Username}`, (err) => {
                        if(err){
                            console.log("1")
                            console.log(err)
                            res.send("Happened a server-side error!")
                        }else{
                            
                        }
                    })
                    fs.mkdirSync(`./RegisteredUsers/${Username}/Ext`, (err) => {
                        if(err){
                            console.log("2")
                            console.log(err)
                            res.send("Happened a server-side error!")
                        }else{
                            
                        }                
                    })
                    fs.writeFileSync(`./RegisteredUsers/${Username}/Ext/Files.json`, `{"Files":[],"RealFiles":[],"DisplayTypes":[], "Extensions":[], "Size":[], "FreeSpace": 625000000, "TotalFiles": 0}`, (err) => {
                        if(err){
                            console.log("3")
                            console.log(err)
                            res.send("Happened a server-side error!")
                        }else{
                            
                        }
                    })
                    fs.mkdirSync(`./RegisteredUsers/${Username}/Files`, (err) => {
                        if(err){
                            console.log("4")
                            console.log(err)
                            res.send("Happened a server-side error!")
                        }
                    })
                    
                    
                    
                    
                    
                }
               
                fs.exists(`./RegisteredUsers/${Username}/Files/${TheFile.name}`, (result) => {
                    if(result == true){
                        console.log("5")
                        res.send("You already have a file with this name in your Server Foulder!")
                    }else{
                        TheFile.mv(`./RegisteredUsers/${Username}/Files/${TheFile.name}`)
                        let TheUserFiles = require(`./RegisteredUsers/${Username}/Ext/Files.json`)
                        if(TheUserFiles.FreeSpace - TheFile.size > 0){
                            let newFile = `{"${TheFile.name}" : "${DisplayMode}"}`
                            TheUserFiles.Size.push(TheFile.size)
                            TheUserFiles.Extensions.push(TheFile.mimetype)
                            TheUserFiles.DisplayTypes.push(DisplayMode)
                            TheUserFiles.RealFiles.push(TheFile.name)
                            TheUserFiles.TotalFiles += 1
                            TheUserFiles.FreeSpace -=  TheFile.size
                            newFile = JSON.parse(newFile)
                            TheUserFiles.Files.push(newFile)
                            fs.writeFile(`./RegisteredUsers/${Username}/Ext/Files.json`, JSON.stringify(TheUserFiles), (err, result) => {
                                if(err){
                                    console.log("6")
                                    res.send("Happened a server-side error!")
                                    console.log(err)
                                }
                            })
                            console.log("7")
                            res.send("Your file was saved with success!")
                        }else{
                            console.log("8")
                            res.send("Your don't have FreeSpace in your folder!")
                        }

                    }
                })
            })
        }
        else{
            console.log("Sem arquivooooooo")
        }
            
    }else{
        console.log("9")
        res.send("Field is empty!")
    }
    
})

app.post("/SearchFile", (req,res) => {
    let ThePassword = req.body.ServerAccess
    let FilePath = req.body.FilePath
    let filePathSplitted = FilePath.split("/")
    fs.exists(`./RegisteredUsers/${filePathSplitted[0]}/Files/${filePathSplitted[1]}`, (result) => {
        if(result == true){
            let JsonToSend = null
            let Files = require(`./RegisteredUsers/${filePathSplitted[0]}/Ext/Files.json`)
            let LengthOfFilesArray = Files.Files.length
            let Found = false
            let DisplayType = ""
            let i = 0
            while(i < LengthOfFilesArray){
                if(Files.Files[i][filePathSplitted[1]] != undefined && Files.Files[i][filePathSplitted[1]] != null){
                    Found = true
                    break
                }
                i++
            }
            if(Found == true){
                DisplayType = Files.Files[i][filePathSplitted[1]]
            }else{
                DisplayType = "Critical Error!"
            }
            if(result == true){
                if(DisplayType == "Text"){
                    fs.readFile(`./RegisteredUsers/${filePathSplitted[0]}/Files/${filePathSplitted[1]}`, 'utf8', (err, result) => {
                        if(err){
                            res.send("Happened a error on server-side of application!")
                            console.log(err)
                        }else{
                            JsonToSend = {
                                Exists:true,
                                DisplayMode:DisplayType,
                                ForTextDisplay:result
                            }
                            res.send(JsonToSend)
                        }
                    })
                }
                else{
                    JsonToSend = {
                        "Exists" : true,
                        "DisplayMode" : DisplayType
                    }
                    res.send(JsonToSend)
                }
                
            }else{
                JsonToSend = {
                    "Exists" : false
                }
                res.send(JsonToSend)
            }
            

        }else{
            res.send("File or user not found!")
        }
        
    })
})

app.get("/ShowFile/:User/:File", (req,res) => {
    let User = req.params.User
    let File = req.params.File
    fs.exists(`./RegisteredUsers/${User}/Files/${File}`, (result) => {
        if(result == true){
            res.sendfile(`./RegisteredUsers/${User}/Files/${File}`)
        }
        if(result == false){
            res.send("This file not exists!")
        }
    })
})

app.get("/Download/:User/:File", (req,res) => {
    let User = req.params.User
    let File = req.params.File
    fs.exists(`./RegisteredUsers/${User}/Files/${File}`, (result) => {
        if(result == true){
            res.download(`./RegisteredUsers/${User}/Files/${File}`)
        }
        else{
            res.send("File not found!")
        }
    })
})

app.post("/GetProfile", (req,res) => {
    let Access = req.body.Access
    let Name = req.body.Name
    if(Access == ServerAccess){
        fs.exists(`./RegisteredUsers/${Name}`, (result) => {
            if(result == true){
                let Info = require(`./RegisteredUsers/${Name}/Ext/Files.json`)
                let JsonToSend = {
                    Name: Name,
                    Files: Info.Files,
                    RealFiles: Info.RealFiles,
                    DisplayTypes: Info.DisplayTypes,
                    Extensions: Info.Extensions,
                    Size: Info.Size,
                    FreeSpace: Info.FreeSpace,
                    FilesUploaded: Info.TotalFiles
                }
                res.send(JsonToSend)
                
               
            }else{
                res.send("User not have files")
            }
        })
    }else{
        res.send("Your access is forbidden for this API!")
    }
})

app.post("/Authentication", (req,res) => {
    let Access = req.body.Access
    let Name = req.body.Name
    Authentication(Name,res)

})

app.delete("/DeleteFile", (req,res) => {
    let FileName = req.body.FileName
    let User = req.body.UserName
    let Access = req.body.Password
    if(Access == ServerAccess){
        fs.exists(`./RegisteredUsers/${User}/Files/${FileName}`, (result) => {
            if(result == true){
                let UserAndFileInfo = require(`./RegisteredUsers/${User}/Ext/Files.json`)
                let lenOfFiles = UserAndFileInfo.RealFiles.length
                let i = 0
                let have = false
                while(i < lenOfFiles){
                    if(UserAndFileInfo.RealFiles[i] == FileName){
                        have = true
                        break
                    }
                    i++
                }
                let SizeToTrash = UserAndFileInfo.Size[i]
                UserAndFileInfo.Files.splice(i, 1)
                UserAndFileInfo.RealFiles.splice(i,1)
                UserAndFileInfo.DisplayTypes.splice(i,1)
                UserAndFileInfo.Extensions.splice(i,1)
                UserAndFileInfo.TotalFiles -= 1
                UserAndFileInfo.Size.splice(i,1)
                UserAndFileInfo.FreeSpace += SizeToTrash
                fs.unlink(`./RegisteredUsers/${User}/Files/${FileName}`, (err) => {

                })
                fs.writeFileSync(`./RegisteredUsers/${User}/Ext/Files.json`,JSON.stringify(UserAndFileInfo),  (err) => {

                })
                res.send("The file was deleted!")
                
            }else{
                res.send("File not exists!")
            }
        })
    }
    else{
        console.log(req.body.Password + " " + ServerAccess)
        res.send("You not have permission to do a request for this API!")
    }
})


app.listen(3540, () => {
    console.log("Server running on port 3540!")
})