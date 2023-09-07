const getTokenFromHeader = require("../auth/getTokenFromHeader");
const verifyToken = require("../auth/verifyToken");

const authenticate = (req, res, next) => {

    const token = getTokenFromHeader(req.headers);

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = { ...decoded };
            next();
        } else {
            res.status(401).json({
                message: 'No autorizado'
            })
        }
    } else {
        res.status(401).json({
            message: 'No autorizado'
        })
    }
}


module.exports = authenticate;
