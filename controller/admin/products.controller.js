// [GET] /admin/products 

const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: "",
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "No Active",
            status: "inactive",
            class: ""
        }
    ];
    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    let find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword
        const regex = new RegExp(keyword, "i"); // case insensitive 
        find.title = regex;
    }
    const products = await Product.find(find);
    // console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Products List",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    }
    );
}