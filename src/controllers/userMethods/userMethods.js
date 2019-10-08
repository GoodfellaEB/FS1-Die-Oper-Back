const NewsLtr = require('../newsletter/newsletter.js');
const User = require('../../schema/userSchema.js');
const passwordHash = require("password-hash");
const jwt = require('jwt-simple');


function signup(req, res) {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        var user = {
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            newsletter: req.body.newsletter,
            admin: req.body.admin
        }
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
            }, function (err, result) {
                if (err) {
                    reject(500);
                } else {
                    if (result) {
                        reject(204)
                    } else {
                        resolve(true)
                    }
                }
            })
        })

        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    //sendConfInscript(user.email);  //--> A DECOMMENTER POUR TESTER ENVOIE DE MAIL DE CONFIRMATION
                    NewsLtr.sendConfInscript(user.email),
                    res.status(200).json({
                        "text": "Succès",
                        "firstName": user.firstName,
                        "token": user.getToken()
                    })
                }
            })
        }, function (error) {
            switch (error) {
                case 500:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                    break;
                case 204:
                    res.status(204).json({
                        "text": "L'adresse email existe déjà"
                    })
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        })
    }
}

function login(req, res) {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            }
            else if(!user){
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (user.authenticate(req.body.password)) {
                    console.log("Login: OK");
                    res.status(200).json({
                        "firstName": user.firstName,
                        "token": user.getToken(),
                        "text": "Authentification réussi"
                    })
                }
                else{
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
}

function clearUsers(req, res){
    User.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.end('success');
        }
    })
}

function selectUser(req, res){
    var userInfo = jwt.decode(req.body.token, "IllikosWebAppCreation");
    console.log(userInfo);
    res.status(200).json({
        "text": "USER OK",
        "token": req.body.token,
        "email": userInfo.email,
        "newsletter": userInfo.newsletter,
        "password": userInfo.password,
        "firstName": userInfo.firstName,
        "lastName": userInfo.lastName
    })
}

function getlogin(req, res){
    User.find({}, function (err, user) {
        if (err) throw err;
        else {
            res.status(200).json({
                "users": user
            })
        }
    })
}

function getUser(req, res) {
    console.log("userName : "+req.query.userName);
    User.findOne({userName: req.query.userName}, function (err, user) {
        if (err) throw err;
        else {
            console.log(user);
            res.status(200).json({
                "user": user
            });
        }
    })
}

//On exporte des fonctions

exports.login = login;
exports.getlogin = getlogin;
exports.signup = signup;
exports.selectUser = selectUser;
exports.clearUsers = clearUsers;
exports.getUser = getUser;
