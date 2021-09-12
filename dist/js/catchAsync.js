import {
    showAlert
} from "./alert"

export const catchAsync = fn => {
    return (...args) => {
        fn(...args).catch(err => {
            showAlert('error', err.response.data.message);
        });
    }
}