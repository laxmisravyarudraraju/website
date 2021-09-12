import axios from 'axios';

export const startTimer = async () => {
    const coupons = $('.offer');
    Array.from(coupons).forEach(async (el, i) => {
        const res = await axios.get(`/api/v1/coupons/${el.dataset.id}`);
        const countDownTime = (new Date(`${res.data.coupon.offerEndDate}`)).getTime();

        const interval = setInterval(async function () {
            const now = new Date().getTime();
            const timeGap = countDownTime - now;

            const days = Math.floor(timeGap / (24 * 60 * 60 * 1000)) || 0;
            const hours = Math.floor((timeGap % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)) || 0;
            const minutes = Math.floor((timeGap % (60 * 60 * 1000)) / (60 * 1000)) || 0;
            const seconds = Math.floor((timeGap % (60 * 1000)) / 1000) || 0;

            if (timeGap < 0) {
                clearInterval(interval);
                $(`.offer[data-id=${el.dataset.id}] .offerValidFor`).text('Coupon Expired');
                await axios.patch(`/api/v1/coupons/${el.dataset.id}`, {
                    offerActive: false
                });
                location.reload(true);
            }
            $(`.offer[data-id=${el.dataset.id}] > .offerValidFor`).text(`${days}days ${hours}hrs ${minutes}min ${seconds}s`);
        }, 1000);
    });

}