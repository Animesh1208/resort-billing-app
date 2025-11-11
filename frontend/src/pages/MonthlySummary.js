import React, { useState, useEffect } from 'react';
import { billsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Calendar, Download, TrendingUp, Receipt, DollarSign } from 'lucide-react';
import './MonthlySummary.css';

const MonthlySummary = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getMonthlySummary({ month, year });
      setSummary(response.data);
    } catch (error) {
      alert('Error loading summary: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await billsAPI.getMonthlySummaryPDF({ month, year });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monthly-summary-${year}-${month}.pdf`);
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  return (
    <>
      <Navbar />
      <div className="monthly-summary-container">
        <div className="summary-header">
          <div>
            <h1>Monthly Summary</h1>
            <p>View and download monthly revenue reports</p>
          </div>
          <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={loading || !summary}>
            <Download size={18} />
            Download PDF
          </button>
        </div>

        <div className="month-selector">
          <div className="selector-group">
            <label>
              <Calendar size={18} />
              Month
            </label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {monthNames.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>
              <Calendar size={18} />
              Year
            </label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : summary ? (
          <>
            <div className="summary-stats-grid">
              <div className="stat-card revenue">
                <div className="stat-icon">
                  <TrendingUp size={28} />
                </div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">{formatCurrency(summary.totalRevenue)}</p>
                </div>
              </div>

              <div className="stat-card bills">
                <div className="stat-icon">
                  <Receipt size={28} />
                </div>
                <div className="stat-content">
                  <h3>Total Bills</h3>
                  <p className="stat-value">{summary.totalBills}</p>
                  <p className="stat-detail">
                    Paid: {summary.paidCount} | Pending: {summary.pendingCount}
                  </p>
                </div>
              </div>

              <div className="stat-card room">
                <div className="stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="stat-content">
                  <h3>Room Charges</h3>
                  <p className="stat-value">{formatCurrency(summary.totalRoomCharges)}</p>
                </div>
              </div>

              <div className="stat-card food">
                <div className="stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="stat-content">
                  <h3>Food & Beverages</h3>
                  <p className="stat-value">{formatCurrency(summary.totalFoodCharges)}</p>
                </div>
              </div>

              <div className="stat-card other">
                <div className="stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="stat-content">
                  <h3>Other Charges</h3>
                  <p className="stat-value">{formatCurrency(summary.totalOtherCharges)}</p>
                </div>
              </div>

              <div className="stat-card tax">
                <div className="stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="stat-content">
                  <h3>Total Tax Collected</h3>
                  <p className="stat-value">{formatCurrency(summary.totalTax)}</p>
                </div>
              </div>
            </div>

            <div className="bills-table-section">
              <h2>Bills for {monthNames[month - 1]} {year}</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Room</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.bills.map((bill) => (
                      <tr key={bill._id}>
                        <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                        <td className="invoice-number">{bill.invoiceNumber}</td>
                        <td>{bill.customerName}</td>
                        <td>{bill.roomNumber}</td>
                        <td className="amount">{formatCurrency(bill.totalAmount)}</td>
                        <td>
                          <span className={`status-badge status-${bill.status}`}>
                            {bill.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>Select a month and year to view summary</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MonthlySummary;
