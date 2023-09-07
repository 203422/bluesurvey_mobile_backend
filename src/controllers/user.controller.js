const User = require('../models/user');
const createAccessToken = require('../auth/generateToken')

const signUp = async (req, res) => {

    const { username, email, password } = req.body;
    if (!!!username || !!!email || !!!password) {
        return res.status(400).json({
            error: 'Todos los campos son requeridos'
        });
    }

    //Crear el usuario
    try {
        //Verificar si existe el usuario
        const user = new User();
        const exists = await user.userExist(email);

        if (exists) {
            return res.status(400).json(
                { error: 'El usuario ya existe' }
            )
        }

        const newUser = new User({ username, email, password: await User.encryptPassword(password) });
        newUser.save();
        res.status(201).json({
            message: 'Usuario creado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el usuario'
        });
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!!!email || !!!password) {
        return res.status(400).json({
            error: 'Todos los campos son requeridos'
        })
    }
    const user = await User.findOne({ email });

    if (user) {
        const correctPassword = await User.comparePassword(password, user.password)

        if (correctPassword) {

            const userInfo = {
                id: user._id, 
                username: user.username, 
                email: user.email
            }

            const accessToken = createAccessToken(userInfo);

            res.status(200).json({
                id: user._id, email: user.email, username: user.username, token: accessToken
            });
        } else {
            res.status(401).json({
                error: 'Usuario o contraseña incorrecto'
            });
        }
    } else {
        res.status(404).json({
            error: 'Usuario no econtrado'
        });
    }
}

const getUser = (req, res) => {
    try {
        const {id, username, email, password} = req.user;

        const token = createAccessToken({id, username, email, password})
        
        res.status(200).json({
            id: id,
            email: email,
            username: username,
            token: token,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener datos'
        })
    }
}

module.exports = { signUp, signIn, getUser }