let btns = document.querySelectorAll(".btn-right");
let notyf = new Notyf({
    duration: 3000,
});

let callbackPostIndex = (data) => {
    if (data.success) {
        notyf.success({
            message: data.success,
            dismissible: true,
        });
    } else if (data.error) {
        notyf.error(data.error);
    }
};

btns.forEach((btn) => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        Ask(`Are your sure u want to drop this table ?`).then(confirmed => {
            if (confirmed) {
                postData(admin_path+"/drop/table",{
                    "table":btn.dataset.table
                },callbackPostIndex);
            }
        })     
    })
});