import axios from 'axios';
import {
    catchAsync
} from './catchAsync';

export const updateSettings = catchAsync(async (data, type) => {
    const url = type === 'password' ? '/api/v1/users/update-password' : '/api/v1/users/update-me';
    await axios.patch(url, data);
});