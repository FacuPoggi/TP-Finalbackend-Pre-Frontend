import { Router } from "express";
import userManager from "../dao/ManagersGeneration/userManager.js";
import passport from "passport";


const routerUser = Router()

// routerUser.post("/", async(req,res)=>{
//     if(await userManager.createUser(req,res)=="Usuario agregado"){
//         res.redirect('api/session/login')
//     }else{
//         console.error("Usuario no agregado")
//     }
// })


routerUser.post("/register",passport.authenticate('register'), async(req,res)=>{
    const mensaje = await userManager.createUser(req,res)
    if(mensaje=="Usuario Agregado"){
        res.redirect('auhtSession/github')
    }else{
        console.error(mensaje)
    }
})


routerUser.get('/email/:email', async (req, res) => {
    res.send(await userManager.getElementByEmail(req.params.email));
})




routerUser.get('/register', async (req, res) => {
    res.render("register", {
        titulo: "Desafio 4",
    })
})

export default routerUser