import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import userManager from '../dao/ManagersGeneration/userManager.js'
import cartManager from '../dao/ManagersGeneration/cartManager.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { authToken, generateToken } from '../utils/jwt.js'

//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion
//Passport define done como si fuera un res.status()

const JWTStrategy = jwt.Strategy //Estrategia de JWT
const ExtractJWT = jwt.ExtractJwt //Extractor ya sea de headers o cookies, etc


const initializePassport = () => {

    const cookieExtractor = (req) => {
        //Si existen cookies, verifico si existe mi cookie  sino asigno null
        const token = req.cookies ? req.cookies.jwtCookies : null
        //Si no existe, asigno undefined
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //De donde extraigo mi token
        secretOrKey: process.env.SIGNED_COOKIE //Mismo valor que la firma de las cookies
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))


    //Ruta a implementar
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Validar y crear Usuario
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await userManager.getElementByEmail(username) //Username = email

                if (user) { //Usuario existe
                    return done(null, false) //null que no hubo errores y false que no se creo el usuario

                }

                const passwordHash = createHash(password)
                const carrito = await cartManager.addElements({ products: [] });
                const userCreated = await userManager.addElements([{
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash,
                    rol: "User",
                    idCart: carrito[0]._id
                }])
                const token = generateToken(user)

                console.log(token)
                return done(null, userCreated) //Usuario creado correctamente

            } catch (error) {
                return done(error)
            }

        }

    ))


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await userManager.getElementByEmail(username)

            if (!user) { //Usuario no encontrado
                return done(null, false)
            }
            if (validatePassword(password, user.password)) { //Usuario y contraseña validos
                const token = generateToken(user)
                console.log(token)
                return done(null, user)
            }

            return done(null, false) //Contraseña no valida

        } catch (error) {
            return done(error)
        }
    }))
    /*
    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/authSession/githubSession'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await userManager.getElementByEmail(profile._json.email)
            if (user) { //Usuario ya existe en BDD
                done(null, user)
            } else {
                const passwordHash = createHash('coder123')
                const userCreated = await userManager.addElements([{
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 23,
                    password: passwordHash //Contraseña por default ya que no puedo accder a la contraseña de github
                }])
                done(null, userCreated)
            }
        } catch (error) {
            return done(error)
        }
    }))*/

    //Iniciar la session del usuario
    passport.serializeUser((user, done) => {
        console.log(user)
        if (Array.isArray(user)) {
            done(null, user[0]._id)
        } else {
            done(null, user._id)
        }
    })

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getElementById(id)
        done(null, user)

    })

}

export default initializePassport