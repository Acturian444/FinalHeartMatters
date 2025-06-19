require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static('./'));

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { postId, priceAmount, successUrl, cancelUrl } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Post Replies Unlock',
                        description: 'Unlock all replies for this post forever',
                    },
                    unit_amount: priceAmount, // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                postId: postId
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn('⚠️  Warning: STRIPE_SECRET_KEY not set. Please set it as an environment variable.');
    }
}); 