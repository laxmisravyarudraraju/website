import axios from 'axios';
import {
    showAlert
} from './alert';
import {
    catchAsync
} from './catchAsync';

export const signup = catchAsync(async (name, email, password, confirmPassword) => {
    await axios.post('/api/v1/users/signup', {
        name,
        email,
        password,
        confirmPassword
    });
    window.setTimeout(() => {
        location.assign('/home')
    }, 1500);
})

export const login = catchAsync(async (email, password) => {
    const response = await axios.post('/api/v1/users/login', {
        email,
        password
    });
    window.setTimeout(() => {
        if (location.pathname === '/login') location.assign(`/${response.data.user.name.split(' ').join('').toLowerCase()}`);
        else location.reload(true);
    }, 2000);
});

export const logout = catchAsync(async () => {
    await axios.get('/api/v1/users/logout');
    window.setTimeout(() => {
        location.assign('/home')
    }, 1500);
});
