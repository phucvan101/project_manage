// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus);

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href); // hàm sử dùng url

    buttonStatus.forEach(button => {
        // console.log(button);
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            // console.log(url.href);
            window.location.href = url.href;

        });

    })
}
/* End Button Status */

/*Form Search */
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); // có kết kết hợp với status trạng thái hoạt động  or ... 
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

/*End Form Search */

/*Pagination */
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            // console.log(page);
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
//*End pagination*/

//*Checkbox Multi*//
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        // console.log(inputCheckAll.checked);
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        }
        else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            // console.log(countChecked);
            // console.log(inputsId.length);
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }

        });
    })
}
//* End Checkbox Multi *//


// * Form Change multi *//
const formChangeMulti = document
    .querySelector("[form-change-multi]");
if (formChangeMulti) {
    // console.log(formChangeMulti);
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent page reload
        // console.log(e);
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        // console.log(inputsChecked);
        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            })
            console.log(ids.join(", "));
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Please select at least one record");
        }
    });

}
// * Form Change multi *// 
