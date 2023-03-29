import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import { Schema } from "mongoose";
import { createHash, validatePassword } from "../../../utils/bcrypt.js";
const url = process.env.URLMONGODB

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: true
    }
})

export class ManagerUserMongoDB extends ManagerMongoDB {
    constructor() {
        super(url, "users", userSchema)

    }

    async getElementByEmail(email) {
        super.setConnection()
        try {
            return await this.model.findOne({ email: email })
        } catch (error) {
            return error
        }
    }
    async createUser(req, res) {
        const { first_name, last_name, email, age, rol, password } = req.body
        try {
            const user = await this.getElementByEmail(email)
            if (user) {
                return "Usuario ya existente"
            } else {
                const hashPassword = createHash(password);
                await this.addElements([{
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    rol: rol,
                    password: hashPassword
                }])
                return "Usuario Agregado"
            }


        } catch (error) {
            console.error(error)
            return error;
        }
    }

    async checkLogin(email, password) {

        const usuario = await this.getElementByEmail(email);
        if (usuario != null) {
            if (validatePassword(password, usuario.password)) {
                return "Login exitoso"
            } else {
                return "Login sin exito"
            }
        } else {
            return "No existe ese mail registrado"
        }
    }
}