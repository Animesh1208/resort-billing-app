import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { Download, ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import './BillDetail.css';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBill = async () => {
    try {
      const response = await billsAPI.getById(id);
      setBill(response.data);
    } catch (error) {
      alert('Error loading bill: ' + error.message);
      navigate('/bills');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await billsAPI.getPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bill.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading PDF: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bill-detail-container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!bill) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="bill-detail-container">
        <div className="detail-header">
          <button className="btn btn-secondary" onClick={() => navigate('/bills')}>
            <ArrowLeft size={18} />
            Back to Bills
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            <Download size={18} />
            Download PDF
          </button>
        </div>

        <div className="invoice-card">
          <div className="invoice-header">
            <div>
              <h1>GULMOHAR RESORT</h1>
              <p>Harindungri Jail Road, Ghatsila</p>
              <p>Phone: +91 9234549012</p>
            </div>
            <div className="invoice-title">
              <h2>TAX INVOICE</h2>
              <p className="invoice-number">{bill.invoiceNumber}</p>
            </div>
          </div>

          <div className="invoice-info-grid">
            <div className="info-card">
              <div className="info-icon">
                <User size={24} />
              </div>
              <div>
                <p className="info-label">Customer Name</p>
                <p className="info-value">{bill.customerName}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Calendar size={24} />
              </div>
              <div>
                <p className="info-label">Invoice Date</p>
                <p className="info-value">{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="info-label">Room Number</p>
                <p className="info-value">{bill.roomNumber}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Calendar size={24} />
              </div>
              <div>
                <p className="info-label">Stay Duration</p>
                <p className="info-value">{bill.numberOfDays} {bill.numberOfDays > 1 ? 'Days' : 'Day'}</p>
              </div>
            </div>
          </div>

          <div className="stay-dates">
            <div>
              <span className="date-label">Check-In:</span>
              <span className="date-value">{format(new Date(bill.checkIn), 'MMM dd, yyyy')}</span>
            </div>
            <div>
              <span className="date-label">Check-Out:</span>
              <span className="date-value">{format(new Date(bill.checkOut), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          <div className="charges-section">
            <h3>Charges Breakdown</h3>
            <table className="charges-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.roomCharges > 0 && (
                  <tr>
                    <td>Room Charges ({bill.numberOfDays} {bill.numberOfDays > 1 ? 'days' : 'day'})</td>
                    <td className="text-right">{formatCurrency(bill.roomCharges)}</td>
                  </tr>
                )}
                {bill.foodCharges > 0 && (
                  <tr>
                    <td>Food & Beverages</td>
                    <td className="text-right">{formatCurrency(bill.foodCharges)}</td>
                  </tr>
                )}
                {bill.otherCharges > 0 && (
                  <tr>
                    <td>Other Charges</td>
                    <td className="text-right">{formatCurrency(bill.otherCharges)}</td>
                  </tr>
                )}
                <tr className="subtotal-row">
                  <td><strong>Subtotal</strong></td>
                  <td className="text-right"><strong>{formatCurrency(bill.subtotal)}</strong></td>
                </tr>
                <tr>
                  <td>Tax ({bill.taxPercentage}%)</td>
                  <td className="text-right">{formatCurrency(bill.tax)}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>TOTAL AMOUNT</strong></td>
                  <td className="text-right"><strong>{formatCurrency(bill.totalAmount)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="payment-info">
            <div className="payment-method">
              <span>Payment Method:</span>
              <span className="method-badge">{bill.paymentMethod.toUpperCase()}</span>
            </div>
            <div className="payment-status">
              <span>Status:</span>
              <span className={`status-badge status-${bill.status}`}>
                {bill.status.toUpperCase()}
              </span>
            </div>
          </div>

          {bill.notes && (
            <div className="notes-section">
              <h4>Notes:</h4>
              <p>{bill.notes}</p>
            </div>
          )}

          <div className="invoice-footer">
            <p>Generated by: <strong>{bill.createdBy?.fullName}</strong></p>
            <p>Thank you for staying with us!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillDetail;
