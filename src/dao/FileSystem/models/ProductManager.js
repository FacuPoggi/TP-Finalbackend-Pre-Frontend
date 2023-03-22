import fs from "fs";

class Producto {
    constructor(title, description, price, thumbnail, code, stock, status, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }
}

const producto1 = new Producto("Samsung S20", "Celular Samsung de alta gama", 10000, ["public/img/samsung-s20.jpg", "Otra posible imagen"], "aaaa", 10, true, "Celulares");
const producto2 = new Producto("Xiaomi Mi-9", "Celular Xiaomi de gama media", 5000, ["public/img/xiaomi-mi-9.jpg"], "aaab", 256, true, "Celulares");
const producto3 = new Producto("Iphone X", "Celular Apple de alta gama", 8000, ["public/img/iphone-x.jpg"], "aaac", 56, true, "Celulares");
const producto4 = new Producto("Mouse Logitech", "Mouse de marca Logitech", 6000, ["public/img/mouse-logitech.jpg"], "aaad", 32, true, "Gaming");
const producto5 = new Producto("MacBook", "Laptop marca Apple modelo Mac Air", 15000, ["public/img/mac-air.jpg"], "aaae", 22, true, "Laptop");
const producto6 = new Producto("Apple TV", "Decodificador marca Apple", 5000, ["public/img/apple-tv.jpg"], "aaaf", 253, true, "Electrodomestico");
const producto7 = new Producto("Smart TV Novatech", "Television Smart TV", 10000, ["public/img/smart-tv-novatech.jpg"], "aaag", 56, true, "Electrodomestico");
const producto8 = new Producto("Notebook Lenovo", "Notebook Lenovo", 7000, ["public/img/notebook-lenovo.jpg"], "aaah", 526, true, "Laptop");
const producto9 = new Producto("Parlante Kalley", "Parlante", 4000, ["public/img/parlante-kalley.jpg"], "aaai", 32, true, "Electrodomestico");
const producto10 = new Producto("HP Pavilion", "Impresora marca HP", 3000, ["public/img/hp.pavilion.jpg"], "aaaj", 22, true, "Electrodomestico");

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkArchivo = () => {
        return fs.existsSync(this.path)
    }
    crearArchivo = async () => {
        await fs.promises.writeFile(this.path, "[]")
    }
    addProduct = async (newProduct) => {
        let i = 0;
        let cantidadCampos = 8;
        for (const campo in newProduct) {
            i++
        }
        console.log(i)
        if (i == cantidadCampos) {
            if (newProduct.status === true && newProduct.category.length > 0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0 && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
                let contenido = await fs.promises.readFile(this.path, "utf-8");
                let arrayProductos = JSON.parse(contenido);
                if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
                    return "Ya existe el producto";
                }
                else {
                    let contenido = await fs.promises.readFile(this.path, "utf-8");
                    let aux = JSON.parse(contenido);
                    if (aux.length > 0) {
                        const idAutoincremental = aux[aux.length - 1].id + 1; //Esto para que sea incremental dependiendo del ultimo elemento
                        aux.push({ id: idAutoincremental, ...newProduct });
                        console.log(aux)
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto agregado"
                    }
                    else {
                        const idAutoincremental = 1;
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto agregado"
                    }

                }
            } else {
                return "No puede tener campos vacios"
            }
        } else {
            return `Falta o sobra al menos 1 campo (deben ser ${cantidadCampos})`
        }

    }

    getAllProducts = async () => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        return aux;
    }
    updateProduct = async ({ id, title, description, price, thumbnail, code, stock, status, category }) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            if (title != undefined) {
                if (title.length > 0) {
                    aux[pos].title = title;
                }
            }
            if (description != undefined) {
                if (description.length > 0) {
                    aux[pos].description = description;
                }
            }
            if (price != undefined) {
                if (price.length > 0) {
                    aux[pos].price = parseFloat(price);
                }
            }
            if (thumbnail != undefined) {
                if (thumbnail.length > 0) {
                    aux[pos].thumbnail = thumbnail;
                }
            }
            if (aux.some(prod => prod.code == code)) {
                return "No puede poner un codigo que ya existe"
            } else if (code != undefined) {
                if (code.length > 0) {
                    aux[pos].code = code;
                }
            }
            if (stock != undefined) {
                if (stock.length > 0) {
                    aux[pos].stock = parseInt(stock);
                }
            }
            if (status != undefined) {
                if (status == false) {
                    aux[pos].status = false;
                } else {
                    aux[pos].status = true;
                }
            }
            if (category != undefined) {
                if (category.length > 0) {
                    aux[pos].category = category;
                }
            }

            await fs.promises.writeFile(this.path, JSON.stringify(aux))
            return "Producto actualizado exitosamente";
        } else {
            return "Producto no encontrado para actualizar"
        }

    }
    getProductById = async (id) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            return aux[pos];
        } else {
            return null
        }
    }

    deleteProductById = async (id) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
            return "Producto eliminado exitosamente";
        } else {
            return "No se encontró el producto que desea eliminar"
        }
    }

    cargarArchivo = async () => {
        //tests pedidos y adicionales:
        await this.crearArchivo(); //Es para que si no tiene el array vacio al inicio se lo ponga así evitamos errores, y para asegurarnos que existe el archivo
        await this.addProduct(producto1);
        await this.addProduct(producto2);
        await this.addProduct(producto3);
        await this.addProduct(producto4);
        await this.addProduct(producto5);
        await this.addProduct(producto6);
        await this.addProduct(producto7);
        await this.addProduct(producto8);
        await this.addProduct(producto9);
        await this.addProduct(producto10);

    }

}
/* const manager = new ProductManager('src/models/products.json');
const tests = async () => {
    await manager.updateProduct({ id: 1, title: "2", description: "3", price: "4", thumbnail: ["5"], code: "6", stock: "7", status: false, category: "9" })
};

tests(); */