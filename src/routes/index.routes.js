import { Router } from "express";
import routerSession from "./session.routes.js";
import routerChat from "./chat.routes.js";
import routerProduct from "./products.routes.js";
import routerCart from "./cart.routes.js";
import routerUser from "./user.routes.js";
import routerGithub from "./github.routes.js";
import express from "express";
import { __dirname } from "../path.js";
import { loginControl } from "../dao/ManagersGeneration/sessionManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";
import productManager from "../dao/ManagersGeneration/productManager.js";
import routerPermisos from "./permisos.routes.js";
import { passportError, roleVerification } from "../utils/errorMessage.js";
const router = Router();


//SI EL TOKEN SE GUARDARA EN LA COOKIE COMO QUERÍA, PODRÍA USAR LA VERIFICACIÓ  N POR AUTH DE LA COOKIE CON ESTOS 2 MIDDLEWARE
//passportError('jwt'), roleVerification(["User"])
router.use('/chat', routerChat)
router.use('/api/products', routerProduct)
router.use('/api/carts', routerCart)
router.use('/user', routerUser)
router.use('/api/session/', routerSession)
router.use('/authSession', routerGithub)
router.use('/', express.static(__dirname + '/public'))
router.use('/politicas', routerPermisos)


//Si no lo comento al momento de redirigirme a la otra pagina, no funciona
// router.use('*',(req,res)=>{ //Se pone get si se quiere solo mostrar para get, como usamos postman ponemos * por si se prueba con postman
//     res.status(404).send({error:"404 No se encuentra la pagina solicitada"})
// })


//Rutas en inicio
router.get('/products', async (req, res) => {
    if (req.session.user){
        res.render("productsPaginate", {
            titulo: "Trabajo Final",
            
            nombreUsuario: req.session.user.first_name,
            apellidoUsuario: req.session.user.last_name,
        })
    }else{
        res.redirect('/api/session/login')
    }


})

router.get('/carts/:cid', async (req, res) => {
    const resultado = await cartManager.getElementById(req.params.cid)
    if (resultado != undefined) {
        res.send(resultado);
    } else {
        res.send("No existe el carrito o simplemente está vacio")
    }

})



router.get('/productsGet', async (req, res) => {

    const products = await productManager.getElements()
    res.json(products)
})

export default router;