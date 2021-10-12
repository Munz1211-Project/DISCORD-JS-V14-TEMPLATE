const express = require("express");
const app = express()

app.get("/", (req, res) => {
    res.sendStatus(200)
    console.log('Server Up!');
})

app.listen(process.env.PORT)