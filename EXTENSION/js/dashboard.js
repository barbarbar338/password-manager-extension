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
                            <th scope="col">Edit</th>
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
                        <td><button class="btn btn-outline-primary" data-password-see="${i.id}"><i class="fas fa-eye"></i></button></td>
                        <td><button class="btn btn-outline-warning" data-password-edit="${i.id}"><i class="fas fa-pen"></i></button></td>
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
            const editPasswordButtons = $("button[data-password-edit]");
            const deletePasswordButtons = $("button[data-password-delete]");
            for (button of seePasswordButtons) {
                button = $(button);
                const passwordID = button.data().passwordSee;
                button.click(function() {
                    seePassword(passwordID);
                });
            }
            for (button of editPasswordButtons) {
                button = $(button);
                const passwordID = button.data().passwordEdit;
                button.click(function() {
                    editPassword(passwordID);
                });
            }
            for (button of deletePasswordButtons) {
                button = $(button);
                const passwordID = button.data().passwordDelete;
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