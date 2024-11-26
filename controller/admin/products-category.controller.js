const ProductCategory = require('../../models/product-catagory.model')
const Account = require('../../models/account.model')
const systemConfig = require("../../config/system")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    // Search
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    };
    // End Search

    // pagination
    const countPC = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItems: 4,
            currentPage: 1,
        },
        req.query,
        countPC,
    )
    // End Pagination

    const accounts = await Account.find(find)
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Products Category",
        records: newRecords,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        accounts: accounts
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records);
    // console.log(newRecords)
    res.render("admin/pages/products-category/create", {
        pageTitle: "Add Products Category",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("products-category_create")) {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        }
        else {
            req.body.position = parseInt(req.body.position)
        }
        req.body.createdBy = {
            account_id: res.locals.user.id,
        }
        const record = new ProductCategory(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } else {
        return;

    }

}

// [GET] /admin/products-category/detail/:id 
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }

        const record = await ProductCategory.findOne(find)
        res.render('admin/pages/products-category/detail', {
            pageTitle: record.title,
            record: record
        })
    } catch (err) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await ProductCategory.findOne(find);
        const records = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);
        res.render('admin/pages/products-category/edit', {
            pageTitle: "Edit Product Category",
            record: record,
            records: newRecords
        })
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/admin/products-category`)
    }
}


// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("products-category_edit")) {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position);

        if (req.file) {
            req.body.thumbnail = `uploads/${req.file.filename}`
        }
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }
        try {
            await ProductCategory.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash('success', `Updated successfully`)
        } catch (err) {
            req.flash('errors', 'Updated unsuccessful')
        }
        res.redirect('back')

    } else {
        return;
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("products-category_delete")) {
        const id = req.params.id
        await ProductCategory.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            }
        })
        req.flash('success', `Updated successfully`)
        res.redirect('back');
    } else {
        return;
    }

}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("products-category_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await ProductCategory.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
        });
        req.flash('success', `Updated successfully`)
        res.redirect('back');
    } else {
        return;
    }
}