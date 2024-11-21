const md5 = require('md5'); // thư viện mã hóa
const crypto = require('crypto');
const Account = require('../../models/account.model')
const Role = require('../../models/role.model')
const systemConfig = require("../../config/system");
const { request } = require('express');

// [GET] /admin/accounts   
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Account.find(find).select("-password -token")
    for (const record of records) {
        // info permission 
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        })
        record.role = role;
        // info creator
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        })
        if (user) {
            record.accountFullName = user.fullName;
        }
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
    res.render("admin/pages/accounts/index", {
        pageTitle: "Accounts",
        records: records
    })
}

// [GET] /admin/accounts/create 
module.exports.create = async (req, res) => {
    const roles = await Role.find();
    res.render("admin/pages/accounts/create", {
        pageTitle: "Create Account",
        roles: roles
    })
}

// [POST] /admin/accounts/createPost 
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    req.body.createdBy = {
        account_id: res.locals.user.id,
    };
    if (emailExist) {
        req.flash("error", "Email already exists");
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

}

// [GET] /admin/accounts/detail/id  
module.exports.detail = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false,
    }
    const record = await Account.findOne(find)
    res.render('admin/pages/accounts/detail', {
        pageTitle: "Detail Account",
        record: record
    })
}

// [GET] /admin/accounts/edit/id  
module.exports.edit = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false,
    }
    const roles = await Role.find();
    const record = await Account.findOne(find);

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Edit Account",
        record: record,
        roles: roles,
    })
    console.log(record)
}


// [PATCH] /admin/accounts/edit/id  
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: { $ne: id }, // find id different 
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash("error", "Email already exists");
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        try {
            const updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            }
            await Account.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash('success', 'Account updated successfully')
        } catch (err) {
            req.flash('success', 'Account updated failed')
        }
    }
    res.redirect('back');


    // console.log(req.body)
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;
    try {
        await Account.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
        })
        req.flash('success', 'Account deleted successfully')
    } catch (err) {
        req.flash('success', 'Account deleted unexpectedly')
    }
    res.redirect('back')
}