# Razorpay Payment Integration Setup Guide

## Overview
Your Groc App now has **Razorpay payment gateway integration** - the best payment solution for India! Users can add grocery items and proceed to checkout with Razorpay.

## Why Razorpay? ✅

- ✅ Works perfectly in India
- ✅ Supports UPI, Cards, Wallets, NetBanking
- ✅ Instant settlement
- ✅ Test mode available immediately (no invite needed)
- ✅ Most popular in India
- ✅ Excellent documentation

## Setup Steps

### 1. Create Razorpay Account

1. Go to **[Razorpay Dashboard](https://dashboard.razorpay.com)**
2. Click **Sign Up** (Free)
3. Fill in your details:
   - Full Name
   - Email
   - Phone (India)
   - Password
4. Verify OTP sent to email
5. Login to dashboard

### 2. Get API Keys

1. Once logged in, click **Settings** (⚙️ icon)
2. Click **API Keys** in left sidebar
3. You'll see two keys:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (long string)
4. Copy both keys

### 3. Configure Environment Variables

**Update `server/.env`:**

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
CLIENT_URL=http://localhost:3000
```

**Update `client/.env`:**

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
REACT_APP_SERVER_URL=http://localhost:9000
```

### 4. Dependencies Already Installed ✅

```bash
# Server
npm install razorpay

# Client  
npm install razorpay-checkout --legacy-peer-deps
```

## Payment Flow

### User Journey:
1. User adds items from categories or manually
2. Views cart with total price
3. Clicks **"Proceed to Payment"** button
4. Server creates order and returns order_id
5. Razorpay checkout window opens
6. User selects payment method (UPI, Card, Wallet, etc.)
7. Completes payment
8. Signature verified on server
9. Success page displayed with confirmation

### API Endpoints:

#### Create Order
```
POST /payment/create-order
Headers: Authorization: Bearer {token}
Body: {
  items: [ { name, price, quantity } ],
  totalAmount: number
}
Response: { order_id, amount, currency, key_id }
```

#### Verify Payment
```
POST /payment/verify-payment
Headers: Authorization: Bearer {token}
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
Response: { success: true, order_id, payment_id }
```

## Testing with Razorpay Test Cards

### Test Cards Available in Test Mode:

| Card Type | Number | Exp | CVC |
|-----------|--------|-----|-----|
| Visa | 4111 1111 1111 1111 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| Visa (Decline) | 4000 0000 0000 0002 | Any future date | Any 3 digits |

### Test UPI ID:
```
success@razorpay
failure@razorpay
```

### Test Mobile Number:
```
9999999999 (any 10-digit number)
```

## Running the Application

### Step 1: Update Environment Files

1. Copy your Razorpay **Key ID** and **Key Secret** from dashboard
2. Paste into `server/.env` (replace placeholders)
3. Paste Key ID into `client/.env` (replace placeholder)

### Step 2: Start Backend Server

```bash
cd server
npm start
```
Server runs on `http://localhost:9000`

### Step 3: Start Frontend Client

```bash
cd client
npm start
```
Client runs on `http://localhost:3000`

### Step 4: Test the Complete Flow

1. **Register/Login** to your app
2. **Add items** from categories
3. **View cart** - verify items show correctly
4. **Click "Proceed to Payment"** button
5. **Razorpay window opens** with order details
6. **Select payment method** (use test card/UPI)
7. **Complete payment** with test credentials
8. **See success page** with confirmation message

## Components Created/Modified

### New Components:
- `client/src/components/Checkout.js` - Cart summary + Razorpay integration
- `client/src/components/CheckoutSuccess.js` - Payment confirmation page

### Updated Components:
- `server/routes/paymentRoute.js` - Razorpay order & verification endpoints
- `client/src/components/itemList.js` - Added checkout button
- `client/src/components/itemAdder.js` - Pass checkout callback
- `client/src/App.js` - Added checkout routes
- `server/index.js` - Imported payment routes

### Configuration Files:
- `server/.env` - Razorpay credentials
- `client/.env` - Razorpay Key ID
- `server/.env.example` - Template for setup
- `server/package.json` - Added `razorpay` & `dotenv`
- `client/package.json` - Added `razorpay-checkout`

## Going Live (Production)

When you're ready to go live:

1. **Complete Razorpay Account Activation:**
   - Verify business details
   - Add bank account for settlement
   - Complete KYC process

2. **Switch to Live Keys:**
   - Get Live Key ID and Key Secret from dashboard
   - Update `server/.env` with live keys
   - Test with real payments

3. **Update Success/Cancel URLs:**
   - Change `CLIENT_URL` to your live domain
   - Ensure SSL certificate is installed

## Troubleshooting

### "Invalid Razorpay API Key"
- Check that both KEY_ID and KEY_SECRET are correct
- Ensure no extra spaces in `.env` file
- Restart server after updating `.env`

### "Razorpay window not opening"
- Check that razorpay script loaded (check browser console)
- Ensure valid KEY_ID is in client `.env`
- Check browser console for errors

### "Payment verification failed"
- Verify signature generation is correct
- Check that KEY_SECRET is correct
- Ensure order_id and payment_id are passed correctly

### Test Mode Not Working
- Confirm you're in Test Mode (not Live Mode)
- Check dashboard shows "Test" label
- Use test cards/UPI IDs provided above

## Key Features

✅ **Supports Multiple Payment Methods:**
- Credit/Debit Cards (Visa, Mastercard, etc.)
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Wallets (Paytm, Amazon Pay, etc.)
- NetBanking

✅ **Security:**
- JWT token validation on backend
- HMAC-SHA256 signature verification
- Secure order creation
- No sensitive data exposed

✅ **User Experience:**
- Quick checkout process
- Beautiful Razorpay checkout UI
- Supports multiple payment methods
- Instant payment confirmation

## Next Steps (Optional)

- [ ] Add order history to database
- [ ] Send email receipts
- [ ] Implement order tracking
- [ ] Add coupon/discount codes
- [ ] Setup automated refunds
- [ ] Add payment webhook handling
- [ ] Implement multi-currency support

## Support

For issues or questions:
- **Razorpay Docs:** https://razorpay.com/docs
- **Razorpay Support:** https://razorpay.com/support

---

🎉 **You're all set!** Your Groc App now has Razorpay payment integration ready to use in India!
