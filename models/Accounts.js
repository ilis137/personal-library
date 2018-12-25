const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Account = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
        trim: true

    },
    password: {
        type: String,
        required: true,
        minLength: 1,
        trim: true

    }
})


Account.plugin(passportLocalMongoose)

module.exports = mongoose.model("Account", Account)