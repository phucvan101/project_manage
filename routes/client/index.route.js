const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares")
const cartMiddleware = require("../../middlewares/client/cart.middlewares")
const userMiddleware = require("../../middlewares/client/user.middlewares")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")

module.exports = (app) => {
    app.use(categoryMiddleware.category) // tối ưu sử dụng đỡ phải gọi lại 
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use("/", homeRoute);
    app.use("/products", productRoute);
    app.use("/search", searchRoutes);
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    app.use("/user", userRoutes)
}