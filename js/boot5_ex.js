function formNeedsValidated(x) {
    //表单验证提交，添加类x
    var forms = document.querySelectorAll(x);
    // k, l, len;
    // 循环并禁止提交
    for (let x of forms) {
        x.setAttribute('novalidate', '')
    }
    Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);

    });
}