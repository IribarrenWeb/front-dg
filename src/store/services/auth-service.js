import { axios } from "../../axios";
import { env } from "../../boot/env";

function login(user_data) {
    return axios.post('/login', user_data).then((response) => {
        setToken(response)
        return response
    });
}

function isAuth() {
    
    var token = localStorage.getItem(env.tokenName);
    if (token) { // Token is present
        if (token.split('.').length === 3) { // Token with a valid JWT format XXX.YYY.ZZZ
            try { // Could be a valid JWT or an access token with the same format
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                var exp = JSON.parse(window.atob(base64)).exp;
                if (typeof exp === 'number') { // JWT with an optonal expiration claims
                    return Math.round(new Date().getTime() / 1000) < exp;
                }
            } catch (e) {
                return true; // Pass: Non-JWT token that looks like JWT
            }
        }
        return true; // Pass: All other tokens
    }
    return false
}

function setToken(response) {
    if (response.data.status == 'false') {
        return false
    }

    var token = response.data.authorization.token;

    if (token) {
        localStorage.setItem(env.tokenName, token);
    }
};

function logout() {
    if (!isAuth()) {
        return alert('There is no currently authenticated user')
            // return new Error('There is no currently authenticated user')
    }
    localStorage.removeItem(env.tokenName);
    return true
}

function getToken() {
    return localStorage.getItem(env.tokenName);
}

function sendResetEmail(email) {
    return axios.post('/reset-password-request', email).then((res) => {
        return res;
    });
}

function passwordReset(model) {
    return axios.post('/reset-password', model).then((res) => {
        return res;
    });
}

export default {
    login,
    isAuth,
    logout,
    getToken,
    sendResetEmail,
    passwordReset
}