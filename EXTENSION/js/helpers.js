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

function handleError() {
    container.html("<h1>Service offline. Please try again later.</h1>");
}