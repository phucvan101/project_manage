const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug); // tạo ra url thân thiên với người dùng
const productSchema = new mongoose.Schema(
    {

        title: String, // Sản phẩm 1
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title", //san-pham-1
            unique: true,
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const Product = mongoose.model('Product', productSchema, "productsList")


module.exports = Product;