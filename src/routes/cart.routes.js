import { Router } from "express";
import productManager from "../dao/ManagersGeneration/productManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";


const routerCart = Router();

routerCart.get("/", async (req, res) => {
    try {
        const cart = await cartManager.getElements()
        res.status(200).json(cart)
    } catch {
        res.status(200).json({
            message: 'Se ha producido un error al intentar traer todos los carritos'
        })
    }

});

routerCart.put("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.updateAllCartItems(req.params.cid, req.body)
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json({
                message: "Carrito actualizado"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Se ha producido un error al intentar actualizar el carrito",
        });
    }
})

routerCart.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartManager.updateCartItem(req.params.cid, req.params.pid, req.body.quantity)
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json({
                message: "Producto actualizado"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error al intentar actualizar la cantidad de unidades de un mismo producto",
        });
    }
})

routerCart.post("/", async (req, res) => {
    try {
        const cart = await cartManager.addElements({ products: [] })
        const idCart = cart[0]._id
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json({
                message: `Carrito vacio creado, ID: ${idCart}`
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error al crear un carrito",
        });
    }
})

routerCart.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getElementById(req.params.cid)
        const cartPopulate = await cart.populate({ path: 'products.productId', model: cartManager.productModel })
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json(cartPopulate)
        }
    } catch (error) {
        res.status(500).json({
            message: "Se ha producido un error al consultar un carrito por el ID",
        });
    }
})

routerCart.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartManager.addItemToCart(req.params.cid, req.params.pid)
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json({
                message: "Producto agregado con éxito"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Se produjo un error al agregar un producto al carrito",
        });
    }
})

routerCart.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartManager.delItemFromCart(req.params.cid, req.params.pid)
        if (!cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json({
                message: "Producto eliminado con éxito"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Se produjo un error al intentar eliminar el producto del carrito",
        });
    }
})


routerCart.delete("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.delCartItems(req.params.cid)
        if (!cart) {
            res.status(200).json({ message: 'Productos del carrito eliminados con éxito' })
            res.status(200).json(cart)
        }
    } catch (error) {
        res.status(500).json({
            message: "Se produjo un error al intentar eliminar todos los productos del carrito",
        });
    }
})

export default routerCart