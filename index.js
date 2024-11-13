require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('express-flash'); // hiện thị các thông báo tạm thời cho người dùng
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // ghi đè phương thức khác lên html 
const moment = require("moment")
const database = require('./config/database')

const systemConfig = require('./config/system');
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route")
database.connectDB();
const app = express();
const port = process.env.PORT;


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
// flash 
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

// TinyMCE 
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// app local 
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
//route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

