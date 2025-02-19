const ProductCategory = require('../../models/product-catagory.model')
const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")


// [GET] /admin/products 
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

    // Sort 
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc";
    }
    // End Sort

    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // console.log(products);

    for (const product of products) {
        // info creator 
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (user) {
            product.accountFullName = user.fullName;
        }
        // info editor nearly 

        const updatedBy = product.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });
            product.accountFullNameEdit = userUpdated.fullName;
            // console.log(updatedBy.updatedAt);
        }
    }


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
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("product_edit")) {

        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Updated Status successfully")
        res.redirect('back');
    } else {
        return;
    }
}


// [PATCH] / admin/products/change-multi
module.exports.changMulti = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("product_edit")) {

        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        // console.log(type);
        // console.log(ids);
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        switch (type) {
            case "active":
                await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } })
                req.flash("success", `Update Status Of ${ids.length} Products Successfully!!!`)
                break;
            case "inactive":
                await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } })
                req.flash("success", `Update Status Of ${ids.length} Products Successfully!!!`)
                break;
            case "delete-all":
                await Product.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    // deletedAt: new Date()
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    }
                })
                req.flash("success", `Delete ${ids.length} Products Successfully!!!`)
                break;
            case "change-position":
                // console.log(ids)
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateOne({ _id: id }, {
                        position: position,
                        $push: { updatedBy: updatedBy }
                    })
                }
                break;
            default:
                break;
        }

        res.redirect("back");
    } else {
        return;
    }
}

// [DELETE] / admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("product_delete")) {

        const id = req.params.id;
        // await Product.deleteOne({ _id: id });
        await Product.updateOne({ _id: id }, {
            deleted: true,
            // deletedAt: new Date()
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            }
        });
        req.flash("success", `Delete Products Successfully!!!`)
        res.redirect("back");
    } else {
        return;
    }
}


//[GET] /admin/products/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false,
    }

    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.tree(category)
    res.render("admin/pages/products/create", {
        pageTitle: "Add New Products",
        category: newCategory,
    });
};


//[POST] /admin/products/createPost 
module.exports.createPost = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("product_edit")) {

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
        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        req.body.createdBy = {
            account_id: res.locals.user.id,
        };
        const product = new Product(req.body);
        await product.save();

        res.redirect(`${systemConfig.prefixAdmin}/products`)
    } else {
        return;
    }
};

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        // console.log(req.params.id) // params: trường data động 

        const find = {
            deleted: false,
            _id: req.params.id
        };
        const category = await ProductCategory.find({
            deleted: false
        });
        const newCategory = createTreeHelper.tree(category)
        const product = await Product.findOne(find)
        // console.log(product);
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit Products",
            product: product,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};


//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("product_edit")) {

        const id = req.params.id;
        req.body.price = parseInt(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)
        req.body.position = parseInt(req.body.position)

        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }

        try {
            const updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date()
            }

            await Product.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash('success', `Updated successfully`)
        } catch (err) {
            req.flash('success', `Updated unsuccessfully`)
        }

        res.redirect(`back`)
        // console.log(req.file)
        // console.log(req.body)
    } else {
        return;
    }
};

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        // console.log(req.params.id) // params: trường data động 

        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find)
        // console.log(product);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
        // console.log(product)
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};