const User = require('../models/user');
const createAccessToken = require('../auth/generateToken')
const Role = require('../models/role');

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

        const role = await Role.findOne({ name: 'user' })

        const newUser = new User({ username, email, password: await User.encryptPassword(password), roles: [role._id] });
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
    const user = await User.findOne({ email }).populate('roles');

    if (user) {

        const correctPassword = await User.comparePassword(password, user.password)

        if (correctPassword) {

            const userInfo = {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            }

            const accessToken = createAccessToken(userInfo);

            const userInfoUpdated = {
                ...userInfo, token: accessToken,
            };
            console.log(userInfoUpdated);
            res.status(200).json(userInfoUpdated);

        } else {
            res.status(401).json({
                error: 'Correo o contraseña incorrecto'
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
        const { id, username, email, password, roles } = req.user;

        const token = createAccessToken({ id, username, email, password, roles })

        res.status(200).json({
            id: id,
            email: email,
            username: username,
            roles: roles,
            token: token,

        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener datos'
        })
    }
}

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find();

        if (!users) {
            res.status(404).json({
                message: 'No se encontraron usuarios registrados'
            })
        }

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener datos'
        })
    }
}

module.exports = { signUp, signIn, getUser, getAllUsers }