module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword.trim(); // loại bỏ khoảng trắng
        objectSearch.regex = new RegExp(objectSearch.keyword, "i"); // case insensitive 
    }
    return objectSearch
}