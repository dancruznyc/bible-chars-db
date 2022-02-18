const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;
const db = require("./queries.js");

//middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express and Postgres API" });
});

app.get("/characters", db.getCharacters);
app.post("/characters", db.addCharacter);
app.delete("/character/:id", db.deleteCharacter);
app.get("/character", db.getCharacter);
app.put("/characters", db.updateCharacter);

app.listen(port, () => {
  console.log("Server listening on port 5000");
});
