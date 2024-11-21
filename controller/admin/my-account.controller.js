const md5 = require('md5'); // thư viện mã hóa
const Account = require('../../models/account.model')

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Personal information"
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit Personal information"
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

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
}

