const ProductCategory = require("../../models/product-catagory.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({
        deleted: false
    })
    const newProductsCategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductsCategory;
    next();
}