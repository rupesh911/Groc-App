import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Style.css';

const Checkout = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  useEffect(() => {
    fetchItems();
    loadRazorpayScript();
  }, []);

  const fetchItems = () => {
    Axios.get('http://localhost:9000/groccery/getAll', {
      headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
    })
      .then((response) => {
        setItems(response.data);
        const totalPrice = response.data.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotal(totalPrice);
      })
      .catch(() => {
        setError('Unable to fetch items. Please try again.');
      });
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setError('Failed to load payment system');
    };
    document.body.appendChild(script);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Your cart is empty. Add items before checking out.');
      return;
    }

    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const missingField = requiredFields.find((field) => !deliveryInfo[field]?.trim());
    if (missingField) {
      setError('Please fill in your delivery name, phone and address before payment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create order on server
      const orderResponse = await Axios.post(
        'http://localhost:9000/payment/create-order',
        {
          items: items.map(item => ({
            name: item.grocceryItem,
            price: item.price,
            quantity: 1,
          })),
          totalAmount: total,
          deliveryInfo,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
        }
      );

      const { order_id, amount, key_id } = orderResponse.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: key_id,
        amount: amount,
        currency: 'INR',
        name: 'Grocify',
        description: `Payment for ₹${(amount / 100).toFixed(2)}`,
        order_id: order_id,
        handler: async (response) => {
          // Step 3: Verify payment on server
          try {
            const verifyResponse = await Axios.post(
              'http://localhost:9000/payment/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
              }
            );

            if (verifyResponse.data.success) {
              // Payment successful - redirect to success page
              window.location.href = `/checkout-success?order_id=${order_id}&payment_id=${response.razorpay_payment_id}`;
            } else {
              setError('Payment verification failed');
              setLoading(false);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          email: localStorage.getItem('grocify_email') || '',
        },
        theme: {
          color: '#ff5722',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled');
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleDeliveryChange = (event) => {
    const { name, value } = event.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-header">
          <button className="checkout-back-button" onClick={onBack}>
            ← Back to Shopping
          </button>
          <h2>Order Summary</h2>
        </div>

        {error && <div className="checkout-error">{error}</div>}

        {items.length === 0 ? (
          <div className="checkout-empty">
            <p>Your cart is empty. Add items from categories to proceed.</p>
          </div>
        ) : (
          <>
            <div className="checkout-section checkout-items-list">
              <h3>Items in your cart</h3>
              {items.map((item, index) => (
                <div key={index} className="checkout-item">
                  <span className="checkout-item-name">{item.grocceryItem}</span>
                  <span className="checkout-item-price">₹{item.price?.toFixed(0) || 0}</span>
                </div>
              ))}
            </div>

            <div className="checkout-section delivery-form">
              <div className="section-header">
                <h3>Delivery Address</h3>
                <p>Enter delivery details so we can send your order to the right place.</p>
              </div>
              <div className="delivery-grid">
                <div className="delivery-row">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleDeliveryChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="delivery-row">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="delivery-row full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={deliveryInfo.addressLine1}
                    onChange={handleDeliveryChange}
                    placeholder="Street, house number, area"
                  />
                </div>
                <div className="delivery-row">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleDeliveryChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="delivery-row">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={deliveryInfo.state}
                    onChange={handleDeliveryChange}
                    placeholder="Enter state"
                  />
                </div>
                <div className="delivery-row">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={deliveryInfo.pincode}
                    onChange={handleDeliveryChange}
                    placeholder="Enter pincode"
                  />
                </div>
                <div className="delivery-row full-width">
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={deliveryInfo.landmark}
                    onChange={handleDeliveryChange}
                    placeholder="Optional landmark"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section checkout-summary-card">
              <h3>Order Summary</h3>
              <div className="checkout-summary">
                <div className="checkout-row">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Delivery:</span>
                  <span>₹0.00 (Free)</span>
                </div>
                <div className="checkout-divider"></div>
                <div className="checkout-row checkout-total">
                  <span>Total Amount:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
              >
                {loading ? 'Processing...' : `Proceed to Payment (₹${total.toFixed(2)})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;

