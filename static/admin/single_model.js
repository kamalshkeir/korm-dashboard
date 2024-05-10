let form = document.getElementById("myform");
let model_name = form.dataset.model;
let model_id = form.dataset.id;
let inputs = document.querySelectorAll(".input");
let notyf = new Notyf({
    duration: 4000,
})


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
        notyf.success(d.success);
    }else if (d.error) {
        notyf.error(d.error);
    }
    data = new FormData();
}


inputs.forEach((input) => {
    input.addEventListener("change",(e) => {
        e.preventDefault();
        if (input.type == "file") {
            if (input.files) {
                data.set(input.getAttribute("name"),input.files[0]);
            }
        } else if (input.type == "checkbox") {
            if (input.checked) {
                data.set(input.getAttribute("name"),1);
            } else {
                data.set(input.getAttribute("name"),0);
            }
        } else if (input.type == "datetime-local") {
            let val = Date.parse(input.value).toString().substring(0,10);
            if (isNaN(val)) {
                val=Date.now().toString().substring(0,10);
            }
            data.set(input.getAttribute("name"),val);
        } else {
            data.set(input.getAttribute("name"),input.value);
        }
    })
})

form.addEventListener("submit",(e) => {
    e.preventDefault();
    if (document.querySelectorAll("textarea.editor").length > 0) {
        document.querySelectorAll("textarea.editor").forEach(ed => {
            let name = ed.dataset.key;
            data.set(name,ed.value);
        })
    }
    data.set("table",model_name);
    data.set("row_id",model_id);
    postFormData(`${admin_path}/update/row`,data,callbackPost);
})



