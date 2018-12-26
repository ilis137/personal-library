const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const library = mongoose.Schema({
    user: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true

    },
    comments: {
        type: [String],

        minLength: 1,
        trim: true

    }
})

library.plugin(passportLocalMongoose)

module.exports = mongoose.model("library", library)