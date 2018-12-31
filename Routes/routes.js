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
    app.post("/login", passport.authenticate("local", { successRedirect: "/profile", failureRedirect: "/register" }), () => {
        console.log("in login")
    })

    app.get("/register", (req, res) => {
        res.render("register")
    })

    app.post("/register", (req, res) => {

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


    app.get("/profile", authCheck, (req, res) => {
        const user = { user: req.user.username }
        library.find(user).then((doc) => {
            console.log(doc.length)
            if (!doc.length) {
                console.log("user not found")
                    //return res.status(404).send()
                return res.render("profile")
            }

            // res.send(doc)
            res.render("profile", { books: doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })


    app.post("/profile", authCheck, (req, res) => {

        const book = new library({ user: req.user.username, title: req.query.book_title, comments: [] })

        book.save().then((doc) => {
            res.send(doc)
        }).catch((err) => {
            console.log(err)
            res.status(400).send()
        })
    })

    app.delete("/profile", authCheck, (req, res) => {
        const user = { user: req.user.username }
        library.deleteMany(user).then((doc) => {
            if (!doc)
                res.status(404).send()
            res.status(200).send({ doc })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.get("/profile/:book_id", authCheck, (req, res) => {
        const book = { _id: req.params.book_id, user: req.user.username }
        console.log(req.params.book_id)
        library.find(book).then((doc) => {
            console.log(doc)
            if (!doc)
                return res.status(404).send()
            res.render("book", {
                title: doc[0].title,
                id: doc[0]._id
            })
        }).catch((err) => {
            res.status(400).send()
        })
    })

    app.post("/profile/:id", authCheck, (req, res) => {
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

    app.delete("/profile/:id", authCheck, (req, res) => {
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