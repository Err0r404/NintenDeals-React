// Dedicated uri for localhost
let baseUri = 'https://www.nintendeals.jschmitt.fr/';

if(window.location.hostname === "localhost")
    baseUri = 'http://nintendeals.local/';

export default baseUri;
