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
