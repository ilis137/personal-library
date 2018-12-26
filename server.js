const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
    //const router = require("express").Router()


const app = express()
const PORT = process.env.PORT || 3000

//app.use("/profile", router)
app.use(cors())
app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: ["sdfgghhvcde"] }))
app.use(require("body-parser").json())
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
app.use(passport.initialize())
app.use(passport.session())

const Account = require("./models/Accounts")
passport.use(new LocalStrategy(
    Account.authenticate()
))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/ShortURL", { useNewUrlParser: true })

require("./routes/routes")(app)

app.listen(PORT, () => {
    console.log("listening at port 3000")
})