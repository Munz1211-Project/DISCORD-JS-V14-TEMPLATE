const app = require("express")();
const axios = require("axios");

function uptime() {
  app.get("/", (req, res) => {
    res.send("Online..")
  }).listen(3000, () => {
    console.log("Uptime Activated")
  })

  axios({ method: "get", url: "https://name-project.repl.co" })
}
