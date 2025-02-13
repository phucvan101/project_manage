const User = require('../../models/user.model');
const Role = require('../../models/role.model')
const Account = require('../../models/account.model')
const systemConfig = require('../../config/system');
const md5 = require('md5');
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination');

// [GET] / account-clients 
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    // search 
    // if (req.query.status) {
    //     find.status = req.query.status;
    // }
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        // find.fullName = objectSearch.regex;
        find.$or = [
            { fullName: objectSearch.regex },
            { email: objectSearch.regex }, // Có thể thêm email hoặc username nếu cần
        ];
    }
    // end search

    // Pagination
    const countUsers = await User.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItems: 4,
            currentPage: 1,
        },
        req.query,
        countUsers,
    )
    // console.log(objectPagination);
    // end pagination
    const recordClients = await User.find(find).select("-password -tokenUser").limit(objectPagination.limitItems).skip(objectPagination.skip);
    const records = await Account.find(find).select("-password -token")
    for (const record of recordClients) {
        // info permission 
        // const role = await Role.findOne({
        //     _id: record.role_id,
        //     deleted: false,
        // })
        // record.role = role;
        // info creator
        // const user = await Account.findOne({
        //     _id: record.createdBy.account_id
        // })
        // if (user) {
        //     record.accountFullName = user.fullName;
        // }
        // info editor
        const updatedBy = record.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            })
            record.accountFullNameEdit = userUpdate.fullName
        }

        // console.log(updatedBy)
    }

    // //info editor 
    // const updatedBy = record.updatedBy.updatedBy.slice(-1)[0]; // lấy tên người đã sửa cuối cùng trong mảng những người đã sửa
    // if (updatedBy) {
    //     const userUpdate = await User.findOne({
    //         _id: updatedBy.account_id
    //     })
    //     recordClients.accountFullNameEdit = userUpdate.fullName
    // }
    // // end info editor

    res.render('admin/pages/account-clients/index.pug', {
        pageTitle: "Account Clients",
        recordClients: recordClients,
        records: records,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [GET] /admin/account-clients/create 
module.exports.create = async (req, res) => {
    res.render("admin/pages/account-clients/create.pug", {
        pageTitle: "Create Account Client",
    })
}

// [POST] /admin/account-clients/post 
module.exports.createPost = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("account-clients_create")) {
        const emailExist = await User.findOne({
            email: req.body.email,
            deleted: false
        })
        if (emailExist) {
            req.flash('error', 'Email already exists');
            res.redirect("back")
        }
        else {
            req.body.password = md5(req.body.password);
            const record = new User(req.body);
            await record.save();
            res.redirect(`${systemConfig.prefixAdmin}/account-clients`)
        }
    }

}

// [GET] /admin/account-clients/detail/:id 
module.exports.detail = async (req, res) => {
    const record = await User.findOne({
        _id: req.params.id,
    })
    res.render("admin/pages/account-clients/detail.pug", {
        pageTitle: "Detail Account Client",
        record: record,
    })
}

// [GET] /admin/account-clients/edit/:id 
module.exports.edit = async (req, res) => {
    const record = await User.findOne({
        _id: req.params.id,
    })
    res.render("admin/pages/account-clients/edit.pug", {
        pageTitle: "Detail Account Client",
        record: record,
    })
}

// [PATCH] /admin/account-clients/edit/:id 
module.exports.editPatch = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("account-clients_edit")) {
        const id = req.params.id;
        const emailExist = await User.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        })
        if (emailExist) {
            req.flash("error", "Email already exists");
        }
        else {
            if (req.body.password) {
                req.body.password = md5(req.body.password)
            } else {
                delete req.body.password;
            }
            try {
                const updatedBy = {
                    account_id: res.locals.user.id,
                    updatedAt: new Date(),
                }
                console.log(updatedBy)
                await User.updateOne({ _id: id }, {
                    ...req.body,
                    $push: { updatedBy: updatedBy }
                });

            } catch (err) {
                req.flash("success", "User updated failed");
            }
        }
        req.flash("success", "User updated successfully")
        res.redirect('back');

    }
}

// [DELETE] /admin/account-clients/delete/:id 
module.exports.deleteAccountClient = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("account-clients_delete")) {

        const id = req.params.id;
        try {
            await User.updateOne({ _id: id }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }
            })
            req.flash('success', 'Account deleted successfully')
        } catch (err) {
            req.flash('success', 'Account deleted unexpectedly')
        }
        res.redirect('back')
    } else {
        return;
    }
}