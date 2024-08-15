// [GET] /admin/products 

const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
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
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItems: 4,
            currentPage: 1,
        },
        req.query,
        countProducts,


    )
    // if (req.query.page) {
    //     objectPagination.currentPage = parseInt(req.query.page);
    // }
    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    // // console.log(totalPage)
    // objectPagination.totalPage = totalPage;
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

// [PATCH] / admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    res.redirect('back');
}


// [PATCH] / admin/products/change-multi
module.exports.changMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    // console.log(type);
    // console.log(ids);
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            break;
        default:
            break;
    }

    res.redirect("back");
}