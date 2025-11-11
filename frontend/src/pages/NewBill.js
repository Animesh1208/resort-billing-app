import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { Save, X, Calculator } from 'lucide-react';
import Navbar from '../components/Navbar';
import './NewBill.css';

const NewBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    roomCharges: '',
    foodCharges: '',
    otherCharges: '',
    taxPercentage: '18',
    paymentMethod: 'cash',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const room = parseFloat(formData.roomCharges) || 0;
    const food = parseFloat(formData.foodCharges) || 0;
    const other = parseFloat(formData.otherCharges) || 0;
    const taxPercent = parseFloat(formData.taxPercentage) || 0;

    const subtotal = room + food + other;
    const tax = (subtotal * taxPercent) / 100;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.customerName || !formData.roomNumber || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    const room = parseFloat(formData.roomCharges) || 0;
    const food = parseFloat(formData.foodCharges) || 0;
    const other = parseFloat(formData.otherCharges) || 0;

    if (room + food + other <= 0) {
      setError('Total charges must be greater than zero');
      return;
    }

    setLoading(true);

    try {
      const billData = {
        ...formData,
        roomCharges: room,
        foodCharges: food,
        otherCharges: other,
        taxPercentage: parseFloat(formData.taxPercentage) || 18,
      };

      const response = await billsAPI.create(billData);
      alert('Bill created successfully!');
      navigate(`/bills/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotal();

  return (
    <>
      <Navbar />
      <div className="new-bill-container">
        <div className="new-bill-header">
          <h1>Create New Bill</h1>
          <p>Fill in customer details and charges</p>
        </div>

        <form onSubmit={handleSubmit} className="bill-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-section">
            <h2>Customer Information</h2>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className="form-control"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomNumber">Room Number *</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  className="form-control"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkIn">Check-In Date *</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  className="form-control"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOut">Check-Out Date *</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  className="form-control"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Charges & Billing</h2>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="roomCharges">Room Charges (₹)</label>
                <input
                  type="number"
                  id="roomCharges"
                  name="roomCharges"
                  className="form-control"
                  value={formData.roomCharges}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="foodCharges">Food & Beverages (₹)</label>
                <input
                  type="number"
                  id="foodCharges"
                  name="foodCharges"
                  className="form-control"
                  value={formData.foodCharges}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="otherCharges">Other Charges (₹)</label>
                <input
                  type="number"
                  id="otherCharges"
                  name="otherCharges"
                  className="form-control"
                  value={formData.otherCharges}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="taxPercentage">Tax Percentage (%)</label>
                <input
                  type="number"
                  id="taxPercentage"
                  name="taxPercentage"
                  className="form-control"
                  value={formData.taxPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes or comments..."
              ></textarea>
            </div>
          </div>

          <div className="bill-summary">
            <div className="summary-header">
              <Calculator size={24} />
              <h2>Bill Summary</h2>
            </div>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="summary-value">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax ({formData.taxPercentage}%):</span>
                <span className="summary-value">₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total Amount:</span>
                <span className="summary-value">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/bills')}
            >
              <X size={18} />
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Bill
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewBill;
