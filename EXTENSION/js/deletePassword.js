function deletePassword(passwordID) {
    fetch(API_URL + "/password", {
        method: "DELETE",
        body: JSON.stringify({
            id: passwordID.toString()
        }),
        headers: {
            "Authorization": ACCESS_TOKEN,
            "Content-Type": "application/json"
        }
    })    
    .then(r => {
        if (r.ok) return r.json();
        else handleError();
    })
    .then(r => {
        if (r.error) handleError();
        else handleIndex();
    })
    .catch(handleError);
}