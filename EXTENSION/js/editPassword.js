function editPassword(passwordID) {
    container.html(`
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
        <form id="edit-password-form">
            <input type="text" class="form-control" placeholder="Login Data" id="login-data" required><br>
            <input type="password" class="form-control" placeholder="Password" id="password-data" required><br>
            <button class="btn btn-outline-success">Edit</button>
        </form>
    `)
    const goBack = $("#go-back");
    const editPasswordForm = $("#edit-password-form");
    goBack.click(function() {
        handleIndex();
    });
    editPasswordForm.on("submit", function(e) {
        e.preventDefault();
        fetch(API_URL + "/password", {
            method: "PATCH",
            headers: {
                "Authorization": ACCESS_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: $("#login-data").val(),
                password: $("#password-data").val(),
                id: passwordID.toString()
            })
        })
        .then(r => {
            if (r.ok) return r.json();
            else editPasswordError();
        })
        .then(r => {
            console.log(r)
            if (r.error) editPasswordError();
            else handleIndex();
        })
        .catch(editPasswordError);
    });
}

function editPasswordError() {
    container.html(`
        <div class="alert alert-danger" role="alert">
            Service, login data and password should not be undefined
        </div>
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
    `);
    const goBack = $("#go-back");
    goBack.click(function() {
        handleIndex();
    });
}