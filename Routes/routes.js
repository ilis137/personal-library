const passport = require("passport")
const Account = require("../models/Accounts")
const library = require("../models/Library")
module.exports = (app) => {

    app.get("/", (req, res) => {
        res.render("home")
    })
    app.get("/login", (req, res) => {
        res.render("login")
    })
    app.post("/login", passport.authenticate("local", { successRedirect: "/Profile/api/books", failureRedirect: "/register" }), () => {
        console.log("in login")
    })

    app.get("/register", (req, res) => {
        res.render("register")
    })

    app.post("/register", (req, res) => {
        console.log(req.body.username)
        Account.register(new Account({ username: req.body.username, password: req.body.password }), req.body.password, (err, account) => {
            if (err) {
                console.log("render register faliure page " + err)
                return res.render("register", { error: err })
            }
            res.redirect("/login")
        })

        //passport.authenticate("local", { successRedirect: "/profile", failureRedirect: "/login" })

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


    app.get("/profile/api/books", authCheck, (req, res) => {
        const user = { user: req.user.username }
        library.find(user).then((doc) => {
            if (!doc)
                return res.status(404).send()

            res.send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })


    app.post("/profile/api/books", authCheck, (req, res) => {
        const book = new library({ user: req.user.username, title: req.body.book_title, comments: [] })
        book.save().then((doc) => {
            res.send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.delete("/profile/api/books", authCheck, (req, res) => {
        const user = { user: req.user.usernamee }
        library.deleteMany(user).then((doc) => {
            if (!doc)
                res.status(404).send()
            res.status(200).send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.get("/profile/api/books/:id", authCheck, (req, res) => {
        const bookName = { _id: req.params.id, title: req.body.book_title }
        library.findOne(bookName).then((doc) => {
            if (!doc)
                return res.status(404).send()
            res.send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.post("/profile/api/books/:id", authCheck, (req, res) => {
        //const book = new library({ _id: req.params.id, title: req.body.book_title })
        const id = req.params.id
        let comments;
        library.findOne(bookName).then((book) => {
            comments = book.comments

        }).catch((err) => {
            res.status(400).send()
        })
        comments.push(req.body.comment)
        library.findByIdAndUpdate(id, {
            $set: { comments }
        }, { new: true }).then((doc) => {
            res.send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.delete("/profile/api/books/:id", authCheck, (req, res) => {
        const book = { _id: req.params.id }
        library.deleteOne(book).then((doc) => {

            res.status(200).send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}