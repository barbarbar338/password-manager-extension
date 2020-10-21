function handleCreate() {
    container.html(`
        <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
        <form id="add-password-form">
            <input type="text" class="form-control" placeholder="Service" id="service-data" required><br>
            <input type="text" class="form-control" placeholder="Login Data" id="login-data" required><br>
            <input type="password" class="form-control" placeholder="Password" id="password-data" required><br>
            <button class="btn btn-outline-success">Add</button>
        </form>
    `)
    const goBack = $("#go-back");
    const addPasswordForm = $("#add-password-form");
    goBack.click(function() {
        handleIndex();
    });
    addPasswordForm.on("submit", function(e) {
        e.preventDefault();
        fetch(API_URL + "/password", {
            method: "POST",
            headers: {
                "Authorization": ACCESS_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service: $("#service-data").val(),
                login: $("#login-data").val(),
                password: $("#password-data").val()
            })
        })
        .then(r => {
            if (r.ok) return r.json();
            else createPasswordError();
        })
        .then(r => {
            if (r.error) createPasswordError();
            else handleIndex();
        })
        .catch(createPasswordError);
    });
}

function createPasswordError() {
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