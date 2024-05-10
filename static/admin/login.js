let form = document.getElementById("admin-login");
let notyf = new Notyf({
    duration: 4000,
})
let callbackPOST = (data) => {
    if (data.success) {
        window.location.href = admin_path;
    } else if (data.error) {
        notyf.error(data.error);
    }
}
form.addEventListener("submit",(e) => {
    e.preventDefault();
    email = form.email.value;
    pass = form.password.value;
    postData(admin_path+"/login",{
        "email":email,
        "password":pass
    },callbackPOST);
})