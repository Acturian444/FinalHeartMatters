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
        const { type, postId, priceId, successUrl, cancelUrl } = req.body;

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        };

        if (type === 'pack_purchase' && priceId) {
            // Premium Prompt Pack: Use the Stripe Price ID
            sessionConfig.line_items = [{
                price: priceId,
                quantity: 1,
            }];
        } else if (type === 'course_purchase' && priceId) {
            // Digital Course Purchase: Use the Stripe Price ID
            sessionConfig.line_items = [{
                price: priceId,
                quantity: 1,
            }];
        } else if (type === 'post_unlock') {
            // Let It Out – Unlock Replies: Use the Stripe Price ID for $4.99
            sessionConfig.line_items = [{
                price: 'price_1RaPPMQ1hjqBwoa0vVLHNXO1',
                quantity: 1,
            }];
            sessionConfig.metadata = { postId: postId };
        } else {
            // Fallback: legacy custom price (should not be used anymore)
            res.status(400).json({ error: 'Invalid purchase type or missing priceId.' });
            return;
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

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