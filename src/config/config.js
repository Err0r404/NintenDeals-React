// Dedicated uri for localhost
let baseUri = '//www.nintendeals.jschmitt.fr/api/';

if(window.location.hostname === "localhost")
    baseUri = '//nintendeals.local/';

export default baseUri;
