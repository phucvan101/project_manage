const Role = require('../../models/role.model')
const systemConfig = require("../../config/system");

// [GET] /admin/roles  
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find)
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
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
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
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const records = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
        pageTitle: records.title,
        records: records
    })
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({ _id: id }, req.body);
        req.flash('success', `Updated successfully`)
    }
    catch (err) {
        req.flash('success', 'Updated unsuccessful');
    }
    res.redirect('back');
}


// [DELETE] /admin/roles/delete/:id 
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date(),
    })
    req.flash('success', `Updated Successfully`)
    res.redirect('back')
}
