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
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    fetchItems();
    loadRazorpayScript();
  }, []);

  const aggregateItems = (items) => {
    const grouped = {};
    items.forEach(item => {
      const key = item.grocceryItem;
      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          quantity: 1,
          totalPrice: item.price,
        };
      } else {
        grouped[key].quantity += 1;
        grouped[key].totalPrice += item.price;
      }
    });
    return Object.values(grouped);
  };

  const aggregatedItems = aggregateItems(items);
  const aggregatedTotal = aggregatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const fetchItems = () => {
  Axios.get(`${process.env.REACT_APP_SERVER_URL}/groccery/getAll`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('grocify_token')}`,
    },
  })
    .then((response) => {
      setItems(response.data);

      const totalPrice = response.data.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );

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
    if (aggregatedItems.length === 0) {
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
      // Cash on Delivery
      if (paymentMethod === 'cod') {
        const codResponse = await Axios.post(
  `${process.env.REACT_APP_SERVER_URL}/payment/create-cod-order`,
  {
            items: aggregatedItems.map(item => ({
              name: item.grocceryItem,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount: aggregatedTotal,
            deliveryInfo,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
          }
        );

        if (codResponse.data.success) {
          window.location.href = `/checkout-success?order_id=${codResponse.data.order_id}&payment_id=${codResponse.data.order_id}&method=cod`;
        } else {
          setError('Failed to place order');
          setLoading(false);
        }
        return;
      }

      // Razorpay Payment
      const orderResponse = await Axios.post(
  `${process.env.REACT_APP_SERVER_URL}/payment/create-order`,
  {
          items: aggregatedItems.map(item => ({
            name: item.grocceryItem,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: aggregatedTotal,
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
  `${process.env.REACT_APP_SERVER_URL}/payment/verify-payment`,
  {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: aggregatedItems.map(item => ({
                  name: item.grocceryItem,
                  price: item.price,
                  quantity: item.quantity,
                })),
                totalAmount: aggregatedTotal,
                deliveryInfo,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
              }
            );

            if (verifyResponse.data.success) {
              // Payment successful - redirect to success page
              window.location.href = `/checkout-success?order_id=${order_id}&payment_id=${response.razorpay_payment_id}&method=razorpay`;
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

        {aggregatedItems.length === 0 ? (
          <div className="checkout-empty">
            <p>Your cart is empty. Add items from categories to proceed.</p>
          </div>
        ) : (
          <>
            <div className="checkout-section checkout-items-list">
              <h3>Items in your cart</h3>
              {aggregatedItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <div>
                    <span className="checkout-item-name">{item.grocceryItem}</span>
                    {item.quantity > 1 && <span className="checkout-item-name"> (×{item.quantity})</span>}
                  </div>
                  <span className="checkout-item-price">₹{item.totalPrice?.toFixed(0) || 0}</span>
                </div>
              ))}
            </div>

            <div className="checkout-section delivery-form">
              <div className="section-header">
                <h3>Payment Method</h3>
                <p>Choose how you want to pay for your order.</p>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Pay Online (Razorpay)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
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
                  <span>₹{aggregatedTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Delivery:</span>
                  <span>₹0.00 (Free)</span>
                </div>
                <div className="checkout-divider"></div>
                <div className="checkout-row checkout-total">
                  <span>Total Amount:</span>
                  <span>₹{aggregatedTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={loading || aggregatedItems.length === 0}
              >
                {loading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order - Cash on Delivery (₹${aggregatedTotal.toFixed(2)})` : `Proceed to Payment (₹${aggregatedTotal.toFixed(2)})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;

