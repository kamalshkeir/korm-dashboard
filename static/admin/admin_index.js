let btns = document.querySelectorAll(".btn-right");
let callbackPostIndex = (data) => {
    if (data.success) {
        Notify(data.success,"success");
    } else if (data.error) {
        Notify(data.error,"error");
    }
};

btns.forEach((btn) => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        Ask(`Are your sure u want to drop this table ?`).then(confirmed => {
            if (confirmed) {
                postData("/admin/drop/table",{
                    "table":btn.dataset.table
                },callbackPostIndex);
            }
        })     
    })
});