function redirectLoginPage() {
    localStorage.removeItem("access_token");
    ACCESS_TOKEN = undefined;
    container.html(`
        <div class="btn-group mr-2">
            <button class="btn btn-outline-success" data-login-page="login">I Have An Account</button>
            <button class="btn btn-outline-warning" data-login-page="signup">Create An Account</button>
        </div>
    `);
    const login = $("button[data-login-page=login]");
    const signup = $("button[data-login-page=signup]");
    login.click(function() {
        loginPage();
    });
    signup.click(function() {
        signupPage();
    });
}

function loginPage() {
    container.html(`
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
        <form id="login-form">
            <input type="email" class="form-control" placeholder="Mail" id="mail-login" required><br>
            <input type="password" class="form-control" placeholder="Password" id="password-login" required><br>
            <button class="btn btn-outline-success">Login</button>
        </form>
    `);
    const goBack = $("#go-back");
    const loginForm = $("#login-form");
    goBack.click(function() {
        handleIndex();
    });
    loginForm.on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: API_URL + "/auth/login",
            data: {
                mail: $("#mail-login").val(),
                password: $("#password-login").val()
            },
            success: loginSuccess,
            error: loginError
        });
    });
}

function loginSuccess(data) {
    if (data.error) loginError();
    else {
        localStorage.setItem("access_token", data.access_token);
        ACCESS_TOKEN = data.access_token;
        handleIndex();
    }   
}

function loginError() {
    container.html(`
        <div class="alert alert-danger" role="alert">
            Invalid mail or password
        </div>
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
    `);
    const goBack = $("#go-back");
    goBack.click(function() {
        handleIndex();
    });
}