import "dotenv/config"
import express from "express";
import { Server } from "socket.io";
import { getmessageManagers, getproductManagers} from "./dao/daoManager.js";
import { __dirname, __filename } from "./path.js";
import rutasEnInicio from "./routes/routeStarter.routes.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/cart.routes.js";
import { engine } from 'express-handlebars';
import * as path from 'path'
import routerChat from "./routes/chat.routes.js";
import productManager from "./dao/ManagersGeneration/productManager.js";
import MongoStore from "connect-mongo";


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* 
MongoDB Sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 30
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
})) */

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





    // productManager.getElements().then((products) => {
    //     socket.emit("getProducts", products)
    // })
    // socket.on("addProduct", async (info) => {
    //     //Si se quiere agregar elementos al archivo, colocar "productManager.devolverArrayProductos()" en lugar de [info]
    //     productManager.addElements([info]).then(() => {
    //         productManager.getElements().then((products) => {
    //         socket.emit("getProducts", products)
    //     })
    // })
    // })
    




    
    // socket.on("deleteProduct", async id=>{
    //     productManager.deleteElement(id).then(() => {
    //         productManager.getElements().then((products) => {
    //         socket.emit("getProducts", products)
    //         })
    //     })
    // })

})

//Routes
app.use('/', rutasEnInicio)
app.use('/chat', routerChat)
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use("/api/carts", routerCart)
//app.use("/products", routerProductsPaginate)