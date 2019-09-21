
const handleResponse = (xhr, type) => {
    // retrieve content
    const content = document.querySelector('#content');

    // xhr status code check
    switch (xhr.status) {
        case 200:
            content.innerHTML = `<b>Success</b>`;
            break;
        case 400:
            content.innerHTML = `<b>Bad Request</b>`;
            break;    
        case 401:
            content.innerHTML = `<b>Unauthorized</b>`;
            break;
        case 403:
            content.innerHTML = `<b>Forbidden</b>`;
            break;
        case 500:
            content.innerHTML = `<b>Internal Server Error</b>`;
            break;
        case 501:
            content.innerHTML = `<b>Not Implemented</b>`;
            break;
        case 404:
            content.innerHTML = `<b>Resource Not Found</b>`;
            break;
    }

    // parse content
    const obj = {};
    const parser = new DOMParser();

    if (type == 'text/xml') {
        obj.xml = parser.parseFromString(xhr.response, 'application/xml');
    } else {
        obj.json = JSON.parse(xhr.response);
    }

    // if the server sent a message add it to the screen (whatever format)
    if (obj.json) {
        content.innerHTML += `<p>Message: ${obj.json.message}</p>`;
        console.log(obj.json);
    } else if (obj.xml) {
        content.innerHTML += `<p>Message: ${obj.xml.all[1].innerHTML}</p>`;
        console.log(obj.xml.documentElement);
    }
};

const sendAjax = () => {
    // retrieve doc elements
    const pageSel = document.querySelector('#page')
    const typeSel = document.querySelector('#type');
    // get types from selectors
    const url = pageSel.options[pageSel.selectedIndex].value;// + '?loggedIn=yes';
    const type = typeSel.options[typeSel.selectedIndex].value;

    // create request
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.setRequestHeader("Accept", type.includes('xml') ? 'application/xml' : type);
    xhr.onload = () => handleResponse(xhr, type);
    xhr.send();
};

const initialize = () => {
    // get button element
    const submit = document.querySelector('#send');
    // functions to call
    const makeRequest = () => sendAjax();
    // attach to listener
    submit.addEventListener('click', makeRequest);
};

window.onload = initialize;
