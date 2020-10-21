const container = $("#container");
const API_URL = "http://localhost:3000/v1";

let ACCESS_TOKEN = localStorage.getItem("access_token"); 

$(document).ready(function() {
    container.html("<h1>Connecting to service...</h1>");
    fetch(API_URL + "/ping")
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                handleError();
            } else {
                handleIndex();
            }
        })  
        .catch(() => {
            handleError();
        });
});

function handleError() {
    container.html("<h1>Service offline. Please try again later.</h1>");
}

function handleIndex() {
    if (ACCESS_TOKEN) {
        fetch(API_URL + "/auth/access_token_test", {
            headers: {
                "Authorization": ACCESS_TOKEN
            }
        }).then(r => {
            if (r.ok) return r.json();
            else redirectLoginPage();
        }).then(r => {
            if (r.error) {
                redirectLoginPage();
            } else {
                redirectDashboardPage();
            }
        })
        .catch(() => {
            redirectDashboardPage();
        });
    } else {
        redirectLoginPage();
    }
}

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

function redirectDashboardPage() {
    fetch(API_URL + "/password/all", {
        headers: {
            "Authorization": ACCESS_TOKEN
        }
    }).then(r => {
        if (r.ok) return r.json();
        else handleError();
    }).then(r => {
        if (r.error) {
            handleError();
        } else {
            container.html(`
                <button class="btn btn-outline-success" id="create-new">Create New Password</button>
                <button class="btn btn-outline-danger" id="log-out">Log Out</button><br><br>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Service</th>
                            <th scope="col">Login Data</th>
                            <th scope="col">Password</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody id="password-table-body"></tbody>
                </table>
            `);
            const tableBody = $("#password-table-body");
            for (let i of r.passwords) {
                const el = `
                    <tr>
                        <td>${i.service}</td>
                        <td>${i.login}</td>
                        <td><button class="btn btn-outline-warning" data-password-see="${i.id}"><i class="fas fa-eye"></i></button></td>
                        <td><button class="btn btn-outline-danger" data-password-delete="${i.id}"><i class="fas fa-trash"></i></button></td>
                    </tr>
                `;
                tableBody.append(el);
            }
            const logOut = $("#log-out");
            logOut.click(function() {
                localStorage.removeItem("access_token");
                ACCESS_TOKEN = undefined;
                handleIndex();
            });
            const createNew = $("#create-new");
            createNew.click(function() {
                handleCreate();
            });

            const seePasswordButtons = $("button[data-password-see]");
            const deletePasswordButtons = $("button[data-password-delete]");
            for (button of seePasswordButtons) {
                button = $(button);
                const passwordID = button.data().passwordSee;
                button.click(function() {
                    seePassword(passwordID);
                });
            }
            for (button of deletePasswordButtons) {
                button = $(button);
                const passwordID = button.data().passwordSee;
                button.click(function() {
                    deletePassword(passwordID);
                });
            }
        }
    })
    .catch(() => {
        handleError();
    });
}

function seePassword(passwordID) {
    container.html(`See ${passwordID}`);
}

function deletePassword(passwordID) {
    container.html(`Delete ${passwordID}`);
}

function handleCreate() {
    container.html("Create new")
}