const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ]
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const Cart = mongoose.model('Cart', cartSchema, "carts")


module.exports = Cart;