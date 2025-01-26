// Function to parse URL parameters
function getUrlParameters() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return Object.fromEntries(hashParams);
}

// Save relevant token data
// Check for tokens on page load
window.onload = function () {
  const params = getUrlParameters(); // Function to parse URL parameters
  const tokenDisplay = document.getElementById('tokenDisplay');

  // Display token information
  tokenDisplay.innerHTML = '<h2>Token Information</h2>';
  tokenDisplay.innerHTML += '<h3>URL Parameters:</h3>';
  tokenDisplay.innerHTML += '<pre>';
  tokenDisplay.innerHTML += JSON.stringify(params, null, 2);
  tokenDisplay.innerHTML += '</pre>';

  // Check for "code" parameter
  if (params.code) {
    tokenDisplay.innerHTML += '<h3>Code Payload:</h3>';
    tokenDisplay.innerHTML += '<pre>';
    tokenDisplay.innerHTML += params.code;
    tokenDisplay.innerHTML += '</pre>';
  }

  // Check for "expires_in" parameter
  if (params.expires_in) {
    tokenDisplay.innerHTML += '<h3>Expires In:</h3>';
    tokenDisplay.innerHTML += '<pre>';
    tokenDisplay.innerHTML += params.expires_in;
    tokenDisplay.innerHTML += '</pre>';
  }

  // Check for "token_type" parameter
  if (params.token_type) {
    tokenDisplay.innerHTML += '<h3>Token Type:</h3>';
    tokenDisplay.innerHTML += '<pre>';
    tokenDisplay.innerHTML += params.token_type;
    tokenDisplay.innerHTML += '</pre>';
  }

  // Check for "id_token" parameter and decode it
  if (params.id_token) {
    const decodedIdToken = JSON.parse(atob(params.id_token.split('.')[1]));
    tokenDisplay.innerHTML += '<h3>ID Token Payload:</h3>';
    tokenDisplay.innerHTML += `<pre>${JSON.stringify(decodedIdToken, null, 2)}</pre>`;
  }

  // Check for "access_token" parameter and decode it
  if (params.access_token) {
    const decodedAccessToken = JSON.parse(atob(params.access_token.split('.')[1]));
    tokenDisplay.innerHTML += '<h3>Access Token Payload:</h3>';
    tokenDisplay.innerHTML += `<pre>${JSON.stringify(decodedAccessToken, null, 2)}</pre>`;
  }
};