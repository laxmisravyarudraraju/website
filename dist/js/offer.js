import axios from 'axios';
import {
    catchAsync
} from './catchAsync';

export const checkOffer = catchAsync(async () => {
    const response = await axios.get(`/api/v1/coupons/${localStorage.getItem('coupon')}`);
    const coupon = response.data.coupon;
    $('.couponApplied').text(coupon.name);
    $('.discountPrice').text(($('.originalPrice').text() * coupon.offerPercentage).toFixed(2));
    $('.totalPrice').text(($('.originalPrice').text() - $('.discountPrice').text()).toFixed(2));
});