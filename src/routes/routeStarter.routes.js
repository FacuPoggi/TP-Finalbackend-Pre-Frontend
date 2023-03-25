import { Router } from "express";
import { getproductManagers } from "../dao/daoManager.js";
import productManager from "../dao/ManagersGeneration/productManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";


const routeStarter = Router();

routeStarter.get('/productsGet', async (req, res) => {

    const products = await productManager.getElements()
    res.json(products)
})
routeStarter.get('/products', async (req, res) => {

    res.render("productsPaginate", {
        titulo: "Trabajo Práctico Final",
    })

})


routeStarter.get('/carts/:cid', async (req, res) => {
    const resultado = await cartManager.getElementById(req.params.cid)
    if (resultado != undefined) {
        res.status(200).json(resultado)
    } else {
        res.status(200).json({
            message: "No existe el carrito o simplemente esta vacio"
        })
    }
})


export default routeStarter;