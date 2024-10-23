// Decentralization 
const tableDecentralization = document.querySelector("[table-decentralization]")
if (tableDecentralization) {
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", () => {
        let decentralization = [];
        const rows = tableDecentralization.querySelectorAll("[data-name]");

        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    decentralization.push({
                        id: id,
                        decentralization: []
                    })
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    // console.log(name);
                    // console.log(index);
                    // console.log(checked);
                    if (checked) {
                        decentralization[index].decentralization.push(name);
                    }
                })
            }
        })
        console.log(decentralization);
        if (decentralization.length > 0) {
            const formChangeDecentralization = document.querySelector("#form-change-decentralization")
            const inputDecentralization = formChangeDecentralization.querySelector("input[name='decentralization']");
            inputDecentralization.value = JSON.stringify(decentralization);
            formChangeDecentralization.submit();
        }
    });
}
// End Decentralization


// Decentralization Data Default
const dateRecords = document.querySelector("[data-records]");
if (dateRecords) {
    const records = JSON.parse(dateRecords.getAttribute("data-records"));

    const tableDecentralization = document.querySelector("[table-decentralization]");

    records.forEach((record, index) => {
        const decentralization = record.decentralization;

        decentralization.forEach(result => {
            const row = tableDecentralization.querySelector(`[data-name="${result}"]`)
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })

    })

}
// End Decentralization Data Default