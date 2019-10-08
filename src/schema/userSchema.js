const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const config = require('../config/config');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var userSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        unique: true,
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
},{ timestamps: { createdAt: 'created_at' }})

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId' });

userSchema.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function () {
        return jwt.encode(this, config.secret);
    },
    decodeToken: function (token) {
        return jwt.decode(token, config.secret);
    }
}

module.exports = mongoose.model('User', userSchema);