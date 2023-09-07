const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const sign = require('../auth/generateToken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
}
)

userSchema.statics.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.methods.userExist = async function (email) {
    const result = await mongoose.model('User').findOne({ email });
    return !!result;
}

userSchema.statics.comparePassword = async function (password, receivedPassword) {
    const same = await bcrypt.compare(password, receivedPassword);
    return !!same;
}


module.exports = mongoose.model('User', userSchema);