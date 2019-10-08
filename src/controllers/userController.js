const account = require('./userMethods/userMethods.js');

module.exports = function (app) {
    /*
    C'est ici que l'ensemble des routes et des fonctions associées seront placées pour l'api /user
    */
    app.post('/login',account.login);
    /*app.get('/login/sendnewsletter', userMethods.sendNewsletter);
    app.post('/login/sendconfirmationinscription', userMethods.sendConfirmationInscription);*/
    app.get('/login/selectalluser', account.getlogin);
    app.get('/login/clearusers', account.clearUsers);

    app.get('/dashboard', account.selectUser);

    app.post('/signup',account.signup);
    app.get('/getUser', account.getUser);
}

