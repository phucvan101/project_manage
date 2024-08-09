const Product = require("../../models/product.model.js")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });
    console.log(products);

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });
    console.log(newProducts); 1


    res.render("client/pages/products/index", {
        pageTitle: "Products List",
        products: products
    });
}