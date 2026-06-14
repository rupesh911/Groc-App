# Stripe Payment Integration Setup Guide

## Overview
Your Groc App now has Stripe payment gateway integration! Users can add grocery items and proceed to checkout with Stripe.

## Setup Steps

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in to your account
3. Navigate to **Developers** → **API Keys**
4. You'll see two keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 2. Configure Environment Variables

#### Server Configuration (Backend)

Create a `.env` file in `server/` folder:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri_here
```

#### Client Configuration (Frontend)

Create a `.env` file in `client/` folder:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
REACT_APP_SERVER_URL=http://localhost:9000
```

### 3. Install Dependencies

```bash
# Already done, but if needed:
cd server
npm install stripe

cd ../client
npm install stripe @stripe/react-stripe-js --legacy-peer-deps
```

## Features Added

### ✅ Checkout Flow
1. Users add items from categories or manually
2. View cart with total price
3. Click "🛒 Proceed to Checkout" button
4. Redirected to Stripe Checkout page
5. Enter payment details
6. Payment confirmation page

### 📱 Components Created

- **[Checkout.js](client/src/components/Checkout.js)**: Order summary and payment initiation
- **[CheckoutSuccess.js](client/src/components/CheckoutSuccess.js)**: Payment confirmation page
- **[paymentRoute.js](server/routes/paymentRoute.js)**: Backend payment endpoints

### 🔌 API Endpoints

#### Create Checkout Session
```
POST /payment/create-checkout-session
Headers: Authorization: Bearer {token}
Body: {
  items: [ { name, price, quantity } ],
  totalAmount: number
}
Response: { url: "https://checkout.stripe.com/..." }
```

#### Verify Payment
```
POST /payment/verify-payment
Headers: Authorization: Bearer {token}
Body: { sessionId: string }
Response: { success: true, sessionId: string }
```

## Testing with Stripe Test Cards

Use these test card numbers in the Stripe checkout form:

| Card Type | Number | Exp | CVC |
|-----------|--------|-----|-----|
| Visa | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Visa (Decline) | 4000 0000 0000 0002 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |

Use any email and future expiry date.

## Running the Application

### 1. Start Backend Server
```bash
cd server
npm start
```
Server runs on `http://localhost:9000`

### 2. Start Frontend Client
```bash
cd client
npm start
```
Client runs on `http://localhost:3000`

### 3. Test the Flow
1. Register/Login
2. Add items from categories or manually
3. Click "Proceed to Checkout"
4. Use test card numbers provided above
5. Confirm payment
6. See success message

## Important Notes

- ⚠️ Never commit your `.env` files to git
- 🔒 Always use Secret Key on server-side only
- 💳 Test cards work only in Test Mode
- 🚀 Switch to Live Keys in production (after going live with Stripe)
- 📧 Configure email notifications in Stripe Dashboard for order confirmations

## Security Considerations

1. Store Stripe Secret Key in environment variables only
2. API calls validate JWT tokens
3. Payment verification ensures transaction authenticity
4. User data is associated with payment sessions

## Next Steps (Optional Enhancements)

- [ ] Add Razorpay as alternative payment option
- [ ] Store order history in database
- [ ] Send email receipts
- [ ] Implement order tracking
- [ ] Add discount/coupon codes
- [ ] Implement refund management
- [ ] Add multiple payment methods (Apple Pay, Google Pay)

---

For more details, visit [Stripe Documentation](https://stripe.com/docs)
