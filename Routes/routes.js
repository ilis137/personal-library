const passport = require("passport")
const Account = require("../models/Accounts")
const library = require("../models/Library")
module.exports = (app) => {

    app.get("/", (req, res) => {
        res.send("welcome to Personal Library")
    })
    app.get("/login", (req, res) => {
        res.send("login page")
    })
    app.post("/login", passport.authenticate("local", { successRedirect: "/Profile", failureRedirect: "/register" }))

    app.get("/register", (req, res) => {
        res.send("register page")
    })

    app.post("/register", (req, res) => {

        Account.register(new Account({ username: req.body.username, password: req.body.password }), req.body.password, (err, account) => {
            if (err) {
                return console.log("render register faliure page " + err)
            }

        })

        //passport.authenticate("local", { successRedirect: "/profile", failureRedirect: "/login" })
        res.redirect("/login")
    })

    const authCheck = (req, res, next) => {
            //console.log(req.user)
            if (!req.user) {
                res.redirect("/register")
            } else {
                next()
            }
        }
        //if session established profile can be accessed after one login
    router.get("/", authCheck, (req, res) => {

        res.send("profilepage")
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}