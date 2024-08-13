module.exports = (query) => {
    let objectSearch = {
        keywords: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword
        const regex = new RegExp(objectSearch.keyword, "i"); // case insensitive 
        objectSearch.regex = regex;
    }
    return objectSearch
}