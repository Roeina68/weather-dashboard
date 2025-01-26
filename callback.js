// Function to parse URL parameters
function getUrlParameters() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return Object.fromEntries(hashParams);
}

// Save relevant token data
function saveTokenData(params) {
    if (params.id_token) {
        try {
            const decodedIdToken = JSON.parse(atob(params.id_token.split('.')[1])); // Decode the ID token
            const firstName = decodedIdToken.given_name || "Unknown";
            const email = decodedIdToken.email || "Unknown";
            const sub = decodedIdToken.sub; // Extract the unique sub identifier

            // Save to sessionStorage
            sessionStorage.setItem('id_token', params.id_token);
            sessionStorage.setItem('access_token', params.access_token || "N/A");
            sessionStorage.setItem('first_name', firstName);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('sub', sub); // Save the sub value

            console.log("Saved user information:", { firstName, email, sub });
        } catch (error) {
            console.error("Error decoding ID token:", error);
        }
    } else {
        console.warn("ID token not found.");
    }
}

// Display token data on the page
function displayTokenData(params) {
    const tokenDisplay = document.getElementById('tokenDisplay');

    // Display token information
    tokenDisplay.innerHTML = '<h2>Token Information</h2>';
    tokenDisplay.innerHTML += '<h3>URL Parameters:</h3>';
    tokenDisplay.innerHTML += '<pre>';
    tokenDisplay.innerHTML += JSON.stringify(params, null, 2);
    tokenDisplay.innerHTML += '</pre>';

    // Display specific token details if available
    if (params.code) {
        tokenDisplay.innerHTML += '<h3>Code Payload:</h3>';
        tokenDisplay.innerHTML += '<pre>';
        tokenDisplay.innerHTML += params.code;
        tokenDisplay.innerHTML += '</pre>';
    }

    if (params.expires_in) {
        tokenDisplay.innerHTML += '<h3>Expires In:</h3>';
        tokenDisplay.innerHTML += '<pre>';
        tokenDisplay.innerHTML += params.expires_in;
        tokenDisplay.innerHTML += '</pre>';
    }

    if (params.token_type) {
        tokenDisplay.innerHTML += '<h3>Token Type:</h3>';
        tokenDisplay.innerHTML += '<pre>';
        tokenDisplay.innerHTML += params.token_type;
        tokenDisplay.innerHTML += '</pre>';
    }

    if (params.id_token) {
        try {
            const decodedIdToken = JSON.parse(atob(params.id_token.split('.')[1]));
            tokenDisplay.innerHTML += '<h3>ID Token Payload:</h3>';
            tokenDisplay.innerHTML += `<pre>${JSON.stringify(decodedIdToken, null, 2)}</pre>`;
        } catch (error) {
            console.error("Error decoding ID token:", error);
        }
    }

    if (params.access_token) {
        try {
            const decodedAccessToken = JSON.parse(atob(params.access_token.split('.')[1]));
            tokenDisplay.innerHTML += '<h3>Access Token Payload:</h3>';
            tokenDisplay.innerHTML += `<pre>${JSON.stringify(decodedAccessToken, null, 2)}</pre>`;
        } catch (error) {
            console.error("Error decoding Access token:", error);
        }
    }
}

// Redirect to another page after processing tokens
function redirectAfterProcessing() {
    const targetPage = "index.html"; // Replace with the page you want to redirect to
    window.location.href = targetPage;
}

// Check for tokens on page load
window.onload = function () {
    const params = getUrlParameters(); // Parse URL parameters
    saveTokenData(params);            // Save token data in sessionStorage
    displayTokenData(params);         // Display token data in the UI

    // Redirect to another page after processing
    setTimeout(() => {
        redirectAfterProcessing();
    }, 500); // Delay of 0.5 seconds before redirecting
};
