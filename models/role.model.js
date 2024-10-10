const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {

        title: String, // Sản phẩm 1
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const Role = mongoose.model('Role', roleSchema, "roles")


module.exports = Role;