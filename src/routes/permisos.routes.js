import Router from 'express'
import passport from 'passport'
import { passportError, roleVerification } from '../utils/errorMessage.js'

const routerPermisos = Router()

routerPermisos.get("/public", (req, res) => {
    res.send("Ruta publica")
})

routerPermisos.get("/autenticado", passportError('jwt'), (req, res) => {
    res.send(req.user)
})

routerPermisos.get("/premium", passportError('jwt'), roleVerification(["User"]), (req, res) => {
    res.send(req.user)
})

export default routerPermisos