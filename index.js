require('dotenv').config();
const express = require('express');
const route = require("./routes/client/index.route");
const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

//route
route(app);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})