require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY');
const app = express();

// Comma-separated Stripe Price IDs permitted for breakup course checkout (e.g. test + live).
const ALLOWED_COURSE_PRICE_IDS = new Set(
    (process.env.ALLOWED_COURSE_PRICE_IDS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
);
if (ALLOWED_COURSE_PRICE_IDS.size === 0 && process.env.STRIPE_SECRET_KEY) {
    console.warn('[stripe] ALLOWED_COURSE_PRICE_IDS is empty; course checkout will fail until set.');
}

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
        const { type, priceId, successUrl, cancelUrl } = req.body;

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
        };

        if (type !== 'course_purchase' || !priceId) {
            res.status(400).json({ error: 'Invalid purchase type or missing priceId.' });
            return;
        }
        if (!ALLOWED_COURSE_PRICE_IDS.has(priceId)) {
            res.status(400).json({ error: 'Invalid or unauthorized priceId.' });
            return;
        }
        sessionConfig.line_items = [{
            price: priceId,
            quantity: 1,
        }];

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

        const checkoutSession = await stripe.checkout.sessions.retrieve(session, {
            expand: ['line_items'],
        });

        const lineItems = checkoutSession.line_items?.data || [];
        const paidPriceIds = lineItems
            .map((li) => (typeof li.price === 'string' ? li.price : li.price?.id))
            .filter(Boolean);
        const purchasedAllowedCourse = paidPriceIds.some((id) => ALLOWED_COURSE_PRICE_IDS.has(id));

        if (checkoutSession.payment_status === 'paid' && purchasedAllowedCourse) {
            res.json({
                verified: true,
                course: 'breakup_reset',
                message: 'Payment verified successfully',
            });
        } else {
            res.status(402).json({
                verified: false,
                error: 'Payment not completed',
            });
        }
    } catch (error) {
        console.error('Error verifying checkout session:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Export the Express app for Vercel serverless deployment
module.exports = app;
