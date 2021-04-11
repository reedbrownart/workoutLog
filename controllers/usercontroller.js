const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/*
============================================================
REGISTER - THIS ALLOWS A NEW USER TO CREATE A NEW ACCOUNT
============================================================
*/

router.post('/register', async (req, res) => {

    let { email, password } = req.body.user;
    
    try {
        let User = await UserModel.create({
            email,
            password: bcrypt.hashSync(password, 13),
        })

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "email already in use",
            });
        } else {
            res.status(500).json({
                message: "failed to register user",
            });
        }
    }
});

/*
============================================================
LOGIN - THIS ALLOWS A USER TO ACCESS THEIR ACCOUNT
============================================================
*/

router.post('/login', async (req, res) => {
    let { email, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                res.status(200).json({
                    user: loginUser,
                    message: "User Logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect password"
                })
            }
        } else {
            res.status(401).json({
                message: 'user does not exist'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "ya done goofed"
        })
    }
});

module.exports = router;