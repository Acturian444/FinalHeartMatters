require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Add CORS headers for Vercel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Handle OPTIONS requests for CORS
app.options('/create-checkout-session', (req, res) => {
    res.status(200).end();
});

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { type, postId, priceId, successUrl, cancelUrl } = req.body;

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
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

// Verify checkout session endpoint (SECURE)
app.get('/api/verify-checkout', async (req, res) => {
    try {
        const { session } = req.query;
        
        if (!session) {
            return res.status(400).json({ error: 'Session ID required' });
        }

        // Retrieve the checkout session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(session);
        
        // Check if payment was successful
        if (checkoutSession.payment_status === 'paid') {
            res.json({ 
                verified: true, 
                course: 'breakup_reset',
                message: 'Payment verified successfully' 
            });
        } else {
            res.status(402).json({ 
                verified: false, 
                error: 'Payment not completed' 
            });
        }
    } catch (error) {
        console.error('Error verifying checkout session:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Export the Express app for Vercel serverless deployment
module.exports = app;
