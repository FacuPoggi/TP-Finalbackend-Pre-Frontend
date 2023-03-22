import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import { Schema } from "mongoose";

const url = process.env.URLMONGODB

const messageSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export class messageManagerMongoDB extends ManagerMongoDB {
    constructor() {
        super(url, "messages", messageSchema)
        
    }
    
}