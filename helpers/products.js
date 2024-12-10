// tính giá mới cho nhiều sản phẩm 
module.exports.priceNewProducts = (products) => {
    const newProducts = products.map((item) => {
        item.priceNew = (
            (item.price * (100 - item.discountPercentage)) / 100

        ).toFixed(0);
        return item;
    })
    return newProducts;
}

// tính giá mới cho 1 sản phẩm
module.exports.priceNewProduct = (product) => {
    const priceNew = (
        (product.price * (100 - product.discountPercentage)) / 100
    ).toFixed(0);
    return priceNew;
}