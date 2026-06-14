import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { authHeader, getUserEmail } from '../services/authService';
import './Style.css';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios.get('http://localhost:9000/payment/admin/orders', {
          headers: { ...authHeader() },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load admin orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const adminStyles = {
    container: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '2rem',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '1rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#1f2937',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '0.95rem',
    },
    orderCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backgroundColor: '#f9fafb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    orderHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #d1d5db',
    },
    orderMeta: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      fontSize: '0.95rem',
    },
    metaLabel: {
      fontWeight: '600',
      color: '#374151',
    },
    metaValue: {
      color: '#6b7280',
      marginLeft: '0.5rem',
    },
    paymentBadge: {
      display: 'inline-block',
      padding: '0.4rem 0.8rem',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: '600',
      marginRight: '1rem',
    },
    codBadge: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    onlineBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
    pendingBadge: {
      backgroundColor: '#fed7aa',
      color: '#92400e',
      marginLeft: '1rem',
    },
    paidBadge: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      marginLeft: '1rem',
    },
    deliveryInfo: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#fff',
      borderRadius: '6px',
      borderLeft: '4px solid #ff5722',
    },
    deliveryLabel: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.3rem',
    },
    deliveryText: {
      color: '#6b7280',
      fontSize: '0.95rem',
      lineHeight: '1.5',
    },
    itemsSection: {
      marginBottom: '1rem',
    },
    itemsLabel: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem',
      fontSize: '1rem',
    },
    itemTable: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    itemTableHeader: {
      backgroundColor: '#f3f4f6',
      borderBottom: '2px solid #e5e7eb',
    },
    itemTableHeaderCell: {
      padding: '0.75rem',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.9rem',
    },
    itemTableCell: {
      padding: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
      color: '#6b7280',
      fontSize: '0.9rem',
    },
    itemTableRow: {
      backgroundColor: '#fff',
    },
    itemTableRowAlt: {
      backgroundColor: '#f9fafb',
    },
    totalRow: {
      backgroundColor: '#fffbeb',
      fontWeight: '600',
      color: '#1f2937',
    },
  };

  return (
    <div style={adminStyles.container}>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Admin Order Dashboard</h1>
        <p style={adminStyles.subtitle}>Signed in as <strong>{getUserEmail()}</strong></p>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading orders...</div>}
      {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No orders have been placed yet.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div>
          {orders.map((order, idx) => (
            <div key={order._id} style={adminStyles.orderCard}>
              <div style={adminStyles.orderHeader}>
                <div style={adminStyles.orderMeta}>
                  <div>
                    <span style={adminStyles.metaLabel}>User:</span>
                    <span style={adminStyles.metaValue}>{order.userName || order.userEmail}</span>
                  </div>
                  <div>
                    <span style={adminStyles.metaLabel}>Email:</span>
                    <span style={adminStyles.metaValue}>{order.userEmail}</span>
                  </div>
                </div>
                <div style={adminStyles.orderMeta}>
                  <div>
                    <span style={adminStyles.metaLabel}>Order ID:</span>
                    <span style={adminStyles.metaValue}>{order.razorpayOrderId}</span>
                  </div>
                  <div>
                    <span style={adminStyles.metaLabel}>Total Amount:</span>
                    <span style={adminStyles.metaValue}>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={adminStyles.metaLabel}>Order Date:</span>
                    <span style={adminStyles.metaValue}>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div style={adminStyles.deliveryInfo}>
                <div style={adminStyles.deliveryLabel}>📍 Delivery Address</div>
                <div style={adminStyles.deliveryText}>
                  {order.deliveryInfo.fullName}, {order.deliveryInfo.phone}<br />
                  {order.deliveryInfo.address}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ ...adminStyles.paymentBadge, ...(order.paymentMethod === 'cod' ? adminStyles.codBadge : adminStyles.onlineBadge) }}>
                  {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Razorpay Online'}
                </span>
                <span style={{ ...adminStyles.paymentBadge, ...(order.status === 'pending' ? adminStyles.pendingBadge : adminStyles.paidBadge) }}>
                  {order.status?.toUpperCase() || 'COMPLETED'}
                </span>
              </div>

              <div style={adminStyles.itemsSection}>
                <div style={adminStyles.itemsLabel}>📦 Items Ordered</div>
                <table style={adminStyles.itemTable}>
                  <thead style={adminStyles.itemTableHeader}>
                    <tr>
                      <th style={adminStyles.itemTableHeaderCell}>Product</th>
                      <th style={adminStyles.itemTableHeaderCell} style={{ textAlign: 'right' }}>Quantity</th>
                      <th style={adminStyles.itemTableHeaderCell} style={{ textAlign: 'right' }}>Price</th>
                      <th style={adminStyles.itemTableHeaderCell} style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, itemIdx) => (
                      <tr key={`${order._id}-${itemIdx}`} style={itemIdx % 2 === 0 ? adminStyles.itemTableRow : adminStyles.itemTableRowAlt}>
                        <td style={adminStyles.itemTableCell}>{item.name}</td>
                        <td style={{ ...adminStyles.itemTableCell, textAlign: 'right' }}>{item.quantity}</td>
                        <td style={{ ...adminStyles.itemTableCell, textAlign: 'right' }}>₹{item.price.toFixed(0)}</td>
                        <td style={{ ...adminStyles.itemTableCell, textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(0)}</td>
                      </tr>
                    ))}
                    <tr style={adminStyles.totalRow}>
                      <td colSpan="3" style={{ ...adminStyles.itemTableCell, textAlign: 'right' }}>TOTAL:</td>
                      <td style={{ ...adminStyles.itemTableCell, textAlign: 'right' }}>₹{order.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
