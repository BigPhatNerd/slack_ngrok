$(document).ready(function() {
    var loginForm = $('form.login');
    var emailInput = $('input#email-input');
    var passwordInput = $("input#password-input");

    loginForm.on("submit", function(e) {
        e.preventDefault();
        var userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        }

        if(!userData.email || !userData.password) {
            return;
        }

        loginUser(userData.email, userData.password);
        emailInput.val("");
        passwordInput.val("");
    });

    function loginUser(email, password) {
        $.post("/api/login", {
                email: email,
                password: password
            })
            .then(function() {
                window.location.replace("/members");
                // If there's an error, log the error
            })
            .catch(function(err) {
                console.log(err);
            });
    }
})