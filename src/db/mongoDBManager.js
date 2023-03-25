import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export class ManagerMongoDB {

    #url
    constructor(url, collection, schema) {
        this.#url = url //Atributo privado
        this.collection = collection
        this.schema = new mongoose.Schema(schema)
        this.model = mongoose.model(this.collection, this.schema) 
    }

    async setConnection() {
        try {
            await mongoose.connect(this.#url)
            console.log("DB is connected")
        } catch (error) {
            throw error
        }
    }

    async addElements(elements) {
        this.setConnection()
        try {
            return await this.model.insertMany(elements)
        } catch (error) {
            throw error
        }
    }

    async getElements() {
        this.setConnection()
        try {
            return await this.model.find()
        } catch (error) {
            throw error
        }
    }

    async getElementById(id) {
        this.setConnection()
        try {
            return await this.model.findById(id)
        } catch (error) { 
            throw error
        }
    }

    async updateElement(id, info) {
        this.setConnection()
        try {
            return await this.model.findByIdAndUpdate(id, info)
        } catch (error) {
            throw error
        }
    }

    async deleteElement(id) {
        this.setConnection()
        try {
            return await this.model.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }

}