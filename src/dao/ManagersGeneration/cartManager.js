import { getcartManagers } from "../daoManager.js";

const cartData = await getcartManagers()
const cartManager = new cartData.cartManagerMongoDB();

export default cartManager;