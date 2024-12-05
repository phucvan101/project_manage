const ProductCategory = require("../models/product-catagory.model");
module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false,
        });
        let allSub = [...subs];
        for (const sub of subs) {
            const child = await getCategory(sub.id);
            allSub = allSub.concat(child);
            // console.log(sub);
        }
        return allSub;
    }
    const result = await getCategory(parentId);
    return result;
}