import { Router, response } from "express";
import userManager from "../dao/ManagersGeneration/userManager.js";
import { loginTest } from "../dao/ManagersGeneration/sessionManager.js";
import passport from "passport";
import { passportError, roleVerification } from "../utils/errorMessage.js";
const routerSession = Router()


routerSession.get("testJWT", passport.authenticate('jwt', { session: false }, (req, res) => {
    res.send({ "message": "tokenJWT" })
}))

routerSession.get("/current", passportError('jwt'), roleVerification(['User']), (req, res) => {
    res.send(req.user)
})


routerSession.get('/login', async (req, res) => {
    const {message} = req.body;
    res.render("login", {
        titulo: "Trabajo Final",
        // message:req.body.message
    })
})

routerSession.post("/testLogin",passport.authenticate('login') ,async (req, res) => {
    loginTest(req,res)
})


routerSession.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect(200,'/api/session/login', { 
        'divMessage': "Hola"
    })
})




export default routerSession