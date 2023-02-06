let form = document.getElementById("myform");
let model_name = form.dataset.model;
let model_id = form.dataset.id;
let inputs = document.querySelectorAll(".input");


// initialise editor if exist on page
document.querySelectorAll("textarea.editor").forEach((ed) => {
    let e = Jodit.make(ed,{
        useSearch: false,
        enableDragAndDropFileToEditor: true,
        uploader: {
            "insertImageAsBase64URI": true
        },
    });
    e.value = ed.dataset.val;
});



var data = new FormData();

// update form handler
let callbackPost = (d) => {
    if(d.success) {
        new Notification().show(d.success,"success");
    }else if (d.error) {
        new Notification().show(d.error,"error");
    }
    data = new FormData();
}


inputs.forEach((input) => {
    input.addEventListener("change",(e) => {
        e.preventDefault();
        if (input.type == "file") {
            if (input.files) {
                data.append(input.getAttribute("name"),input.files[0]);
            }
        } else if (input.type == "checkbox") {
            if (input.checked) {
                data.append(input.getAttribute("name"),1);
            } else {
                data.append(input.getAttribute("name"),0);
            }
        } else if (input.type == "datetime-local") {
            let val = Date.parse(input.value).toString().substring(0,10);
            if (isNaN(val)) {
                val=Date.now().toString().substring(0,10);
            }
            data.append(input.getAttribute("name"),val);
        }
    })
})

form.addEventListener("submit",(e) => {
    e.preventDefault();
    if (document.querySelectorAll("textarea.editor").length > 0) {
        document.querySelectorAll("textarea.editor").forEach(ed => {
            let name = ed.dataset.key;
            data.append(name,ed.value);
        })
    }
    data.append("table",model_name);
    data.append("row_id",model_id);
    postFormData(`/admin/update/row`,data,callbackPost);
})



