const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug); // tạo ra url thân thiên với người dùng
const productCategorySchema = new mongoose.Schema(
    {

        title: String, // Sản phẩm 1
        parent_id: {
            type: String,
            default: "",
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title", //san-pham-1
            unique: true,
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date,
        }
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category")


module.exports = ProductCategory;