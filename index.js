require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override'); // ghi đè phương thức khác lên html 
const database = require('./config/database')
const systemConfig = require('./config/system');
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route")
database.connect();
const app = express();
const port = process.env.PORT;


app.use(methodOverride('_method'))
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

// app local 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})