const jwt = require('jsonwebtoken');
const User = require('../models/userModel');



exports.requireSignin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({error: 'Unauthorized (authCheck 1)'});

    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
        if (err) return res.status(401).json({error: 'Unauthorized (authCheck 2)'});

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({error: 'Unauthorized'});

        req.user = user;
        next();
    })
}



exports.requireAdmin = async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(401).json({error: 'Unauthorized (requireAdmin)'});
    next();
}