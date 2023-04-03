import userManager from "./userManager.js";
import { validatePassword } from "../../utils/bcrypt.js";


export const loginTest = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (await userManager.checkLogin(email, password) == "Login exitoso") {
            const usuario = await userManager.getElementByEmail(email);
            req.session.first_name = usuario.first_name; //Para mostrar el nombre y el apellido, no mas datos ya que me parece mejor que sean personales y no mostrarlos 
            req.session.last_name = usuario.last_name;
            req.session.role = usuario.rol;
            req.session.login = true
            if (usuario.rol.toLowerCase() == "admin") {
                res.redirect('/products')
            } else if (usuario.rol.toLowerCase() == "user") {
                res.redirect('/products')//Se podría renderizar algo diferente en caso de ser administrador, no se puede registrar desde el programa como admin
            } else {
                console.error("Rol no valido")
            }

        } else {
            res.redirect("/api/session/login", 500, {
                message: "Login incorrecto"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const loginControl = (req, res, next) => {
    req.session.login ? next() : res.redirect('/authSession/githubSession')
}

