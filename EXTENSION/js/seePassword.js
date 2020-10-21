function seePassword(passwordID) {
    fetch(API_URL + "/password?id=" + passwordID, {
        headers: {
            "Authorization": ACCESS_TOKEN
        }
    })
    .then(r => {
        if (r.ok) return r.json();
        else handleError();
    })
    .then(r => {
        if (r.error) handleError();
        else {
            container.html(`
                <button class="btn btn-outline-primary" id="go-back">Go Back</button><br><br>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Service</th>
                            <th scope="col">Login Data</th>
                            <th scope="col">Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${r.password.service}</td>
                            <td>${r.password.login}</td>
                            <td>${r.password.password}</td>
                        </tr>
                    </tbody>
                </table>
            `);
            const goBack = $("#go-back");
            goBack.click(function() {
                handleIndex();
            });
        }
    })
    .catch(handleError);
}