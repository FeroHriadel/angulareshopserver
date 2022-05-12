const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.signup = async (req, res) => {
    try {
        const userExists = await User.findOne({email: req.body.email});
        if (userExists) return res.status(401).json({error: 'Email already taken'});

        let { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) return res.status(400).json({error: 'Name, email, phone, and password are required'});

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        });

        user = await user.save();
        if (!user) res.status(500).json({error: 'Signup failed'});

        res.status(201).json({user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({error: 'Email and Password are required'});

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({error: 'User not found'});

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
            res.json({user: user.email, token});
        } else {
            res.status(401).json({error: 'Invalid credentials'});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        if (!users) return res.status(404).json({error: 'No users found'});

        res.json({users});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) return res.status(404).json({error: 'User not found'});

        res.json({user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.updateUser = async (req, res) => {
    try {
        const oldUser = await User.findById(req.params.userId);
        if (!oldUser) return res.status(404).json({error: 'User not found'});

        let newPassword;
        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = oldUser.passwordHash;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            },
            {new: true}
        )
        if (!updatedUser) return res.status(500).json({error: 'User update failed'});

        updatedUser.passwordHash = undefined;

        res.json({user: updatedUser});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}