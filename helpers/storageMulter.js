const multer = require('multer');
// thiết lập cấu hình lưu trữ file trên đĩa.
module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, res, cb) {
            cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now()
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }
    });
    return storage;
}