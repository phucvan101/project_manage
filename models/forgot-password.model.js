const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180,
        },
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password")


module.exports = ForgotPassword;