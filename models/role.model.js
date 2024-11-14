const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {

        title: String, // Sản phẩm 1
        description: String,
        decentralization: {
            type: Array,
            default: []
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now(),
            }
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date,
        },
        deletedAt: Date
    },
    {
        timestamps: true // createAt and updateAt when the data is changed
    }
);


const Role = mongoose.model('Role', roleSchema, "roles")


module.exports = Role;