// [GET] /admin/products 

const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    const filterStatus = filterStatusHelper(req.query);


    let find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // Pagination: Phan trang 
    let objectPagination = {
        limitItems: 4,
        currentPage: 1,
    }
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    // console.log(totalPage)
    objectPagination.totalPage = totalPage;
    // End Pagination


    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Products List",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    }
    );
}