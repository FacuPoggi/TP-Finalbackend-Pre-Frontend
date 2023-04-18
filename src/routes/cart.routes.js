import { Router } from "express";
const routerCart = Router();
import productManager from "../dao/ManagersGeneration/productManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";



routerCart.get("/", async (req, res) => {
    try {
        res.send(await cartManager.getElements());
    } catch {
        res.send("Error al traer todos los carritos")
    }
});

routerCart.put("/:cid", async (req, res) => {
    try {
        res.send(await cartManager.updateAllCartItems(req.params.cid, req.body));
    } catch {
        res.send("Error al intentar actualizar el carrito")
    }
});



routerCart.put("/:cid/products/:pid", async (req, res) => {

    try {
        res.send(await cartManager.updateCartItem(req.params.cid, req.params.pid, req.body.quantity));
    } catch {
        res.send("Error al intentar actualizar la cantidad")
    }
});



/* se genera con el user 
routerCart.post("/", async (req, res) => {
    try {
        await cartManager.addElements({ products: [] });
        res.send("Carrito vacio creado")
    } catch {
        res.send("Error al agregar carrito")
    }
}); */





routerCart.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getElementById(req.params.cid)
        const cartPopulate = await cart.populate({ path: 'products.productId', model: cartManager.productModel })
        res.send(cartPopulate)
    } catch (error) {
        console.error(error)
        res.send(error)
    }

});




routerCart.post("/:cid/products/:pid", async (req, res) => {
    try {
        res.send(await cartManager.addItemToCart(req.params.cid, req.params.pid));
    } catch {
        res.send("Hubo un error al agregar el producto")
    }
});

routerCart.delete("/:cid/products/:pid", async (req, res) => {
    try {
        res.send(await cartManager.delItemFromCart(req.params.cid, req.params.pid));
    } catch {
        res.send("Hubo un error al intentar eliminar el producto del carrito")
    }
});


routerCart.delete("/:cid", async (req, res) => {
    try {
        await cartManager.delCartItems(req.params.cid);
        res.send("Productos del carrito eliminados")
    } catch {
        console.error("Hubo un error al intentar eliminar el carrito")
    }
});

export default routerCart