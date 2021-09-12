import axios from 'axios';
import {
    catchAsync
} from './catchAsync';

const slug = location.pathname.split('/').slice(-1);

export const sendComment = catchAsync(async (comment) => {
    await axios.post(`/api/v1/blogs/${slug}/comments`, {
        comment
    });
    location.reload(true);
});

export const addReview = catchAsync(async (review, rating) => {
    await axios.post(`/api/v1/plans/${slug}/reviews`, {
        review,
        rating
    });
    location.reload(true);
});

export const addLike = catchAsync(async () => {
    await axios.post(`/api/v1/blogs/${slug}/likes`);
    location.reload(true);
});

export const deleteLike = catchAsync(async () => {
    await axios.delete(`/api/v1/blogs/${slug}/likes`);
    location.reload(true);
});