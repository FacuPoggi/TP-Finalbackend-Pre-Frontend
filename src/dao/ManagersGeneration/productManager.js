import {getproductManagers } from "../daoManager.js";



const productData = await getproductManagers()
const productManager = new productData.productManagerMongoDB();


export default productManager;