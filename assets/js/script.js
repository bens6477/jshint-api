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
        displayException(data);
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

// Function to:
// Iterate through options,
// Push each value into a temporary array
// Convert the array back to a string
function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        console.log(entry);

        if (entry[0] === "options") {
            optArray.push(entry[1]);
        };
    };
    
    form.delete("options");
    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    let init = {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    }

    // Without the body:form key:value pair above, add the form elements as follows:
    // for (let entry of form.entries()) {
    //     console.log(entry);
    //     initObject[e[0]] = e[1];
    // }    

    const response = await fetch(API_URL, init);

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
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


function displayException(data) {
    let heading = "An Exception Occurred";
    let results = `<div>The API returned the following error data.</div>`;
    results += `<div>Status code: <strong><span class="status_code">${data.status_code}</span></strong></div>`;
    results += `<div>Error number: <strong><span class="error_no">${data.error_no}</span></strong></div>`;
    results += `<div>Error text: <strong><span class="error">${data.error}</span></strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    
    resultsModal.show();
}
