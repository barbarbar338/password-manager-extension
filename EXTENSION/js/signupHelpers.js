function signupPage() {
    container.html(`
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
        <form id="signup-form">
            <input type="email" class="form-control" placeholder="Mail" id="mail-signup" required><br>
            <input type="password" class="form-control" placeholder="Password" id="password-signup" required><br>
            <button class="btn btn-outline-success">Signup</button>
        </form>
    `);
    const goBack = $("#go-back");
    const signupForm = $("#signup-form");
    goBack.click(function() {
        handleIndex();
    });
    signupForm.on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: API_URL + "/auth/signup",
            data: {
                mail: $("#mail-signup").val(),
                password: $("#password-signup").val()
            },
            success: signupSuccess,
            error: signupError
        });
    });
}

function signupSuccess(data) {
    if (data.error) signupError();
    else {
        localStorage.setItem("access_token", data.access_token);
        ACCESS_TOKEN = data.access_token;
        handleIndex();
    } 
}

function signupError() {
    container.html(`
        <div class="alert alert-danger" role="alert">
            Mail must be a mail and password must be longer than 8 characters
        </div>
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
    `);
    const goBack = $("#go-back");
    goBack.click(function() {
        handleIndex();
    });
}