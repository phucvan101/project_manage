const Cart = require("../../models/cart.model")
// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId,
    });
    // console.log(cart);
    // console.log(cartId);

    const existProductInCart = cart.products.find(item => item.product_id == productId); // tìm một bản ghi trong js
    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        // console.log(quantityNew)
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        })
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
    }

    // res.send("Ok");
    req.flash('success', 'Add successful product to cart')
    res.redirect('back');
}


