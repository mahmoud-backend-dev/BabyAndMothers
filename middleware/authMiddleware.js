const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const authenticatedMiddleware =  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthenticatedError('Not Bearer Token Provided')
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid Authentication web token ');
    }
};

module.exports = authenticatedMiddleware;