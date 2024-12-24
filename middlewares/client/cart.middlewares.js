const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
    // console.log(req.cookies.cartId);
    if (!req.cookies.cartId) {
        // create a cart
        const cart = new Cart();
        await cart.save();
        const expiresCookie = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });
        // console.log(cart.id);
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        })
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); // reduce là hàm callback trên từng phần tử của mảng
        res.locals.miniCart = cart
        // console.log(cart);
    }
    next();
}