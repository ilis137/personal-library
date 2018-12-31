const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const hbs = require("hbs")

const app = express()
const PORT = process.env.PORT || 3000

hbs.registerPartials(__dirname + "/views/partials")
app.set('view engine', 'hbs');
app.use(cors())
app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: ["sdfgghhvcde"] }))
app.use(require("body-parser").json())
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))

hbs.registerHelper("getBooks", (doc) => {
    let out;
    if (!doc) {
        out = "<ul class='list-group ' id='booklist'><div id='noBooks'class='alert alert-danger container' style='align-self:bottom' role='alert'>No Books Added</div></ul>"

    } else {

        out = "<ul class='list-group'>"
        doc.forEach(data => {
            out += "<li class='list-group-item d-flex justify-content-between align-items-center'><a href='http://localhost:3000/profile/" + data._id + " '>" + data.title + "</a> <i class='far fa-trash-alt deleteBook' style='color:red'></i> </li > "
        })
        out += "</ul>"
    }
    //console.log(out)
    return new hbs.handlebars.SafeString(out)
})

const Account = require("./models/Accounts")
passport.use(new LocalStrategy(
    Account.authenticate()
))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/personallibrary", { useNewUrlParser: true })

require("./routes/routes")(app)

app.listen(PORT, () => {
    console.log("listening at port 3000")
})