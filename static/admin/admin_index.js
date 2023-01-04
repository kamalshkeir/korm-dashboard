let btns = document.querySelectorAll(".btn-right");
let callbackPostIndex = (data) => {
    if (data.success) {
        new Notification().show(data.success,"success");
    } else if (data.error) {
        new Notification().show(data.error,"error");
    }
};

btns.forEach((btn) => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        ask(`Are your sure u want to drop this table ?`).then(confirmed => {
            if (confirmed) {
                postData("/admin/drop/table",{
                    "table":btn.dataset.table
                },callbackPostIndex);
            }
        })     
    })
});