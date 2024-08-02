const Product = require("../../models/product.model.js")

module.exports.index = async (req, res) => {
    const product = await Product.find({
        status: "active",
        deleted: false
    });
    console.log(product);


    res.render("client/pages/products/index", {
        pageTitle: "Products List"
    });
}