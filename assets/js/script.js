const API_KEY = "nzWWZjKM4CPLNHaaKQoFd15R-yI";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// Function to make a request to the API URL with the API key.
// Function to pass the data to a display function
 
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}


async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    let init = {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    }

    // Without the body:form key:value pair above, add the form elements as follows:
    // for (let e of form.entries()) {
    //     initObject[e[0]] = e[1];
    // }    

    const response = await fetch(API_URL, init);

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span><br><br></div>`;
        for (let error of data.error_list) {
            results += `<div><strong>Line <span class="line">${error.line}</span> `;
            results += `column <span class="column">${error.col}</span>: </strong>`;
            results += `<span class="error">${error.error}</span></div><br>`
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
};