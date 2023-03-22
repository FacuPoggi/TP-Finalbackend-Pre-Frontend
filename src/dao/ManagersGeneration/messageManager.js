import { getmessageManagers } from "../daoManager.js";

const messageData = await getmessageManagers()
const messageManager = new messageData.messageManagerMongoDB();

export default messageManager;