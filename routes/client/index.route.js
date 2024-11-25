const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares")

module.exports = (app) => {
    app.use(categoryMiddleware.category) // tối ưu sử dụng đỡ phải gọi lại 
    app.use("/", homeRoute);
    app.use("/products", productRoute);
}