const mongoose = require('mongoose');
module.exports.connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Connected Success!");
    }
    catch (err) {
        console.log("Connect Error!");
    }
}

