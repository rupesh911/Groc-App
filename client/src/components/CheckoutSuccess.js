import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './Style.css';

const CheckoutSuccess = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order_id');
    const paymentId = params.get('payment_id');
    const method = params.get('method');

    if (!orderId || !paymentId) {
      setError('Invalid order details. Order may not have been completed.');
      setLoading(false);
      return;
    }

    // Payment is already verified in Checkout component before redirecting here
    // So we can directly show success
    setSuccess(true);
    setLoading(false);
  }, [location]);

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Verifying your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <div className="checkout-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
          <button
            className="checkout-button"
            onClick={() => history.push('/')}
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '1rem',
              background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    const params = new URLSearchParams(location.search);
    const method = params.get('method');
    const isCOD = method === 'cod';

    return (
      <div className="checkout-container">
        <div className="checkout-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#059669', marginBottom: '1rem' }}>
            {isCOD ? 'Order Confirmed!' : 'Payment Successful!'}
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem', lineHeight: '1.6' }}>
            {isCOD 
              ? 'Thank you for your order. Payment will be collected at delivery. Your groceries will be delivered soon. Check your email for order confirmation and tracking details.'
              : 'Thank you for your order. Your groceries will be delivered soon. Check your email for order confirmation and tracking details.'
            }
          </p>
          <button
            className="checkout-button"
            onClick={() => history.push('/')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckoutSuccess;
