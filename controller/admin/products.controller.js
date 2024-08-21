// [GET] /admin/products 

const Product = require("../../models/product.model")
const systemConfig = require("../../config/system")
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


    const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItems).skip(objectPagination.skip);
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
    req.flash("success", "Updated Status successfully")
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
            req.flash("success", `Update Status Of ${ids.length} Products Successfully!!!`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash("success", `Update Status Of ${ids.length} Products Successfully!!!`)
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() })
            req.flash("success", `Delete ${ids.length} Products Successfully!!!`)
            break;
        case "change-position":
            // console.log(ids)
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                })
            }
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] / admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Delete Products Successfully!!!`)
    res.redirect("back");
}


//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add New Products",
    });
};


//[POST] /admin/products/createPost 
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    // 
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position)
    }
    req.body.thumbnail = `/uploads/${req.file.filename}`;
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`)
    // console.log(req.body)
    console.log(req.file)
    // res.send("ok")
};