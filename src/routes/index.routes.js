import { Router } from "express";
import routerSession from "./session.routes.js";
import routerChat from "./chat.routes.js";
import routerProduct from "./products.routes.js";
import routerCart from "./cart.routes.js";
import routerUser from "./user.routes.js";
import express from "express";
import { __dirname } from "../path.js";
import { loginControl } from "../dao/ManagersGeneration/sessionManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";
import productManager from "../dao/ManagersGeneration/productManager.js";

const router = Router();


router.use('/chat', loginControl, routerChat)
router.use('/api/products', loginControl, routerProduct)
router.use('/api/carts', loginControl, routerCart)
router.use('/user', routerUser)
router.use('/api/session/', routerSession)
router.use('/', express.static(__dirname + '/public'))

//Rutas en inicio
router.get('/products', loginControl, async (req, res) => {
    res.render("productsPaginate", {
        titulo: "Trabajo Final",
        nombreUsuario: req.session.first_name,
        apellidoUsuario: req.session.last_name,
        role: req.session.role
    })

})

router.get('/carts/:cid', loginControl, async (req, res) => {
    const resultado = await cartManager.getElementById(req.params.cid)
    if (resultado != undefined) {
        res.send(resultado);
    } else {
        res.send("No existe el carrito o simplemente está vacio")
    }

})



router.get('/productsGet',loginControl, async (req, res) => {

    const products = await productManager.getElements()
    res.json(products)
})

export default router;