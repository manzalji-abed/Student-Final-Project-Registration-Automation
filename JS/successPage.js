module.exports = {

    get: function(app, dic) {
        app.get("/success", (req, res) => {
            res.sendFile(dic + "/HTML/successPage.html");

        })
    }
}