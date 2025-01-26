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
            const firstName = decodedIdToken.given_name;
            const email = decodedIdToken.email;
            const sub = decodedIdToken.sub; // Extract the unique sub identifier

            // Save to sessionStorage
            sessionStorage.setItem('id_token', params.id_token);
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

config = {}