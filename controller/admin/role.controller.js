const Role = require('../../models/role.model')
const Account = require('../../models/account.model')
const systemConfig = require("../../config/system");

// [GET] /admin/roles  
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find)
    for (const record of records) {
        const user = await Account.findOne({
            _id: record.createdBy.account_id,
        })
        if (user) {
            record.accountFullName = user.fullName
        }
    }
    res.render("admin/pages/roles/index", {
        pageTitle: "Permissions",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Create Permission",
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    // console.log(req.body);
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("roles_create")) {
        req.body.createdBy = {
            account_id: res.locals.user.id,
        };
        const record = new Role(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } else {
        return;
    }
}


// [GET] /admin/roles/detail/:id 
module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const records = await Role.findOne(find);
    res.render("admin/pages/roles/detail", {
        pageTitle: records.title,
        records: records
    })
}

// [GET] /admin/roles/edit/:id 
module.exports.edit = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("roles_edit")) {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const records = await Role.findOne(find);
        res.render("admin/pages/roles/edit", {
            pageTitle: records.title,
            records: records
        })
    } else {
        return;
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("roles_edit")) {
        const id = req.params.id;
        try {
            await Role.updateOne({ _id: id }, req.body);
            req.flash('success', `Updated successfully`)
        }
        catch (err) {
            req.flash('success', 'Updated unsuccessful');
        }
        res.redirect('back');
    } else {
        return;
    }
}


// [DELETE] /admin/roles/delete/:id 
module.exports.delete = async (req, res) => {
    const decentralization = res.locals.role.decentralization;
    if (decentralization.includes("roles_delete")) {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
        })
        req.flash('success', `Updated Successfully`)
        res.redirect('back')
    } else {
        return;
    }
}


// [GET] /admin/roles/decentralization
module.exports.decentralization = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/decentralization", {
        pageTitle: "Decentralization",
        records: records
    })
    console.log(records);
}

// [PATCH] /admin/roles/decentralization
module.exports.decentralizationPatch = async (req, res) => {
    // console.log(req.body);
    const decentralization = JSON.parse(req.body.decentralization);
    // console.log(decentralization)
    for (const item of decentralization) {
        await Role.updateOne({ _id: item.id }, { decentralization: item.decentralization });
    }
    req.flash(`success`, "Updated successfully");

    res.redirect("back");
}