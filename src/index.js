import "dotenv/config"
import express from "express";
import { Server } from "socket.io";
import { getmessageManagers, getproductManagers} from "./dao/daoManager.js";
import { __dirname, __filename } from "./path.js";
import session from 'express-session'
import multer from 'multer'
import { engine } from 'express-handlebars';
import * as path from 'path'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import router from "./routes/index.routes.js";
import passport from 'passport'
import initializePassport from './config/passport.js'



const app = express()

app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 100
    }),
    //store: new fileStore({ path: './sessions', ttl: 1000, retries: 1 }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//PUERTO
app.set("port", process.env.PORT || 5000)

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`))

//Socket.io
const io = new Server(server)
//Messages
const messageData = await getmessageManagers()
const messageManager = new messageData.messageManagerMongoDB();





io.on("connection", async (socket) => {
    console.log("Cliente conectado")
    socket.on("message", async (info) => {
            messageManager.addElements([info]).then(() => {
            messageManager.getElements().then((mensajes) => {
                socket.emit("allMessages", mensajes)
            })
        })
    })
    messageManager.getElements().then((mensajes) => {
        socket.emit("allMessages", mensajes)
    })
})

//Routes
app.use('/',router) 
// app.use("/products",routerProductsPaginate)