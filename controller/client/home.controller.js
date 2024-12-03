const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")

// [GET] /
module.exports.index = async (req, res) => {
    // lay ra san phan noi bat 
    const productsFeatured = await Product.find({
        status: "active",
        deleted: false,
        featured: "1",
    }).limit(6);
    const newProducts = productsHelper.priceNewProducts(productsFeatured)

    // hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        status: "active",
        deleted: false,
    }).sort({ position: "desc" }).limit(6);
    const newProductsNew = productsHelper.priceNewProducts(productsNew)
    // console.log(newProductsNew)
    res.render('client/pages/home/index', {
        pageTitle: "Home page",
        productsFeatured: newProducts,
        productsNew: newProductsNew
    });
}