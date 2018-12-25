module.exports = (app) => {

    app.get("/", (req, res) => {
        res.send("welcome to Personal Library")
    })

    app.post("/login", (req, res) => {

    })

}