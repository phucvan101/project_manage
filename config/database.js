const mongoose = require('mongoose');
module.exports.connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Success!");
    }
    catch (err) {
        console.log("Connect Error!");
    }
}


