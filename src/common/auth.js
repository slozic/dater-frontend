import { jwtDecode } from 'jwt-decode'; // You can install jwt-decode if needed

export function fetchOptionsWithJwtToken(method) {
    const token = localStorage.getItem("token");
    let options = {};
    options.headers = options.headers || {}; // Ensure headers is defined
    if (token) {
        options.headers.Authorization = `${token}`;
    }
    return options;
}

export function parseJwtToken(token) {
    try {
        return jwtDecode(token); // Decodes the token
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
}

export function fetchJwtToken() {
    // Function to retrieve JWT token from localStorage or cookies
    return localStorage.getItem("token") || "";
}
