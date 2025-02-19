// cloudinary 
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});
// end cloudinary
const streamifier = require('streamifier')


module.exports.upload = (req, res, next) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            try {
                let result = await streamUpload(req);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            } catch (error) {
                res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
            }
        }

        upload(req);
    } else {
        next();
    }
}