import { Router } from "express";
import { getproductManagers } from "../dao/daoManager.js";
import productManager from "../dao/ManagersGeneration/productManager.js"

const routerProduct = Router();



routerProduct.get("/", async (req, res) => {
    let { limit, page, stock, category, sort } = req.query;
    let resultadoOperaciones = "error";
    let enlace = "/api/products?";
    let enlaceProximo, enlacePrevio;
    if (limit == undefined) {
        limit = 10;
    } else {
        enlace = enlace + "limit=" + limit + "&"
    }
    if (page == undefined) {
        page = 1;
        enlaceProximo = enlace;
        enlacePrevio = enlace;
    } else {
        enlaceProximo = enlace + "page=" + (parseInt(page) + 1)
        enlacePrevio = enlace + "page=" + (parseInt(page) - 1)
    }


    let resultado;
    if (stock != undefined) {
        resultado = await productManager.paginate({ stock: stock }, { limit: limit, page: page })
        resultadoOperaciones = "success";
    } else if (category != undefined) {
        resultado = await productManager.paginate({ category: category }, { limit: limit, page: page })
        resultadoOperaciones = "success";
    } else {
        resultado = await productManager.paginate({}, { limit: limit, page: page })
        resultadoOperaciones = "success";
    }
    let ordenamiento = 1;


    if (sort != undefined) {
        if (sort.toLowerCase() == "asc") {
            ordenamiento = 1;
        } else if (sort.toLocaleLowerCase() == "desc") {
            ordenamiento = -1;
        }

        resultado = { docs: await productManager.aggregate([{ $sort: { price: ordenamiento } }]) }
        resultadoOperaciones = "success";
    }
    const resultadoFinalPayload = {
        status: resultadoOperaciones,
        payload: resultado.docs,
        totalPages: resultado.totalPages,
        prevPage: resultado.prevPage,
        nextPage: resultado.nextPage,
        page: resultado.page,
        hasPrevPage: resultado.hasPrevPage,
        hasNextPage: resultado.hasNextPage,
        prevLink: enlacePrevio,
        nextLink: enlaceProximo
    }
    res.status(200).json(resultadoFinalPayload)
});


routerProduct.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getElementById(req.params.pid)
        if (!product) res.status(200).json({ msg: 'Producto no encontrado' })
        res.status(200).json(product)
    } catch {
        res.status(500).json({
            message: "No se pudo encontrar el producto"
        })
    }
});

routerProduct.post('/', async (req, res) => {
    try {
        const product = await productManager.addElements(req.body);
        const idProduct = product[0]._id
        if (!product) {
            res.status(200).json(product)
        } else {
            res.status(200).json({
                message: `Producto agregado, ID: ${idProduct}`
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Se encontro un error al agregar un producto",
        });
    }
})

routerProduct.put("/:pid", async (req, res) => {
    try {
        const product = await productManager.updateElement(req.params.pid, { title: req.body.title, description: req.body.description, price: req.body.price, thumbnail: req.body.thumbnail, code: req.body.code, stock: req.body.stock, status: req.body.status, category: req.body.category })
        if (!product) {
            res.status(200).json(product)
        } else {
            res.status(200).json({
                message: "Producto Actualizado"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error en actualizar el producto",
        });
    }
});
routerProduct.delete("/:pid", async (req, res) => {
    try {
        const product = await productManager.deleteElement(req.params.pid)
        if (!product) {
            res.status(200).json(product)
        } else {
            res.status(200).json({
                message: "Producto eliminado"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Hubo un problema al eliminar el producto",
        });
    }
});


export default routerProduct