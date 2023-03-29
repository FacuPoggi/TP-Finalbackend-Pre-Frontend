import { getManagerUsers } from "../daoManager.js";


const data = await getManagerUsers()
const userManager = new data.ManagerUserMongoDB();



export default userManager;