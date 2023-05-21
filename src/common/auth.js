
export function fetchOptionsWithJwtToken(method) {
        const token = localStorage.getItem("token");
        let options = {};
        options.headers = options.headers || {}; // Ensure headers is defined
        if (token) {
            options.headers.Authorization = `${token}`;
        }
        return options;
    }

export function fetchJwtToken() {
        return localStorage.getItem("token");
    }