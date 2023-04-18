import userManager from "./userManager.js";
import { validatePassword } from "../../utils/bcrypt.js";


export const loginTest = async(req,res)=>{
    try {
        if (!req.user) {
            return res.status(401).send({ status: "error", error: "Invalidate User" })
        }
        //Genero la session de mi usuario
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        console.log(req.session.user)
        res.status(200).send({ status: "success", payload: req.user })

    } catch (error) {
        res.status(500).send.json({
            message: error.message
        })
    }
}


export const loginControl = (req, res, next) => {
    req.session.login ? next() : res.redirect('/api/session/login')
}

