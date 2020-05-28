import axios from "axios";

const stripe = Stripe('pk_test_Kms24uZasgsxANi3bqn57MRU00DRfu7c4D');

export const checkout = async (id) => {
    try {
        const sessionId = (await await axios.get(`/api/v1/plans/${id}/checkout`)).data.session.id;

        await stripe.redirectToCheckout({
            sessionId
        })
    } catch (err) {
        console.log(err)
    }

}
