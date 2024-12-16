const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let newProducts = [];
    if (keyword) {
        const regex = new RegExp(keyword, 'i');
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active",
        })
        // console.log(products)
        newProducts = productsHelper.priceNewProducts(products)
    }

    res.render("client/pages/search/index", {
        pageTitle: "Results of search",
        keyword: keyword,
        products: newProducts
    });
}