import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { Search, Download, Eye, Trash2, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './Bills.css';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchParams]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        status: searchParams.get('status'),
        page: pagination.page,
      };
      const response = await billsAPI.getAll(params);
      setBills(response.data.bills);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (billId, invoiceNumber) => {
    try {
      const response = await billsAPI.getPDF(billId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading PDF: ' + error.message);
    }
  };

  const handleDelete = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) {
      return;
    }

    try {
      await billsAPI.delete(billId);
      alert('Bill deleted successfully');
      loadBills();
    } catch (error) {
      alert('Error deleting bill: ' + error.response?.data?.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="bills-container">
        <div className="bills-header">
          <div>
            <h1>Bills & Invoices</h1>
            <p>Manage all customer billing records</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/bills/new')}>
            <Plus size={18} />
            New Bill
          </button>
        </div>

        <div className="bills-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by customer name or invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${!searchParams.get('status') ? 'active' : ''}`}
              onClick={() => navigate('/bills')}
            >
              All
            </button>
            <button
              className={`filter-btn ${searchParams.get('status') === 'paid' ? 'active' : ''}`}
              onClick={() => navigate('/bills?status=paid')}
            >
              Paid
            </button>
            <button
              className={`filter-btn ${searchParams.get('status') === 'pending' ? 'active' : ''}`}
              onClick={() => navigate('/bills?status=pending')}
            >
              Pending
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <Filter size={64} />
            <h3>No bills found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => navigate('/bills/new')}>
              Create First Bill
            </button>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td className="invoice-number">{bill.invoiceNumber}</td>
                      <td>{bill.customerName}</td>
                      <td>{bill.roomNumber}</td>
                      <td>{format(new Date(bill.checkIn), 'MMM dd, yyyy')}</td>
                      <td>{format(new Date(bill.checkOut), 'MMM dd, yyyy')}</td>
                      <td className="amount">{formatCurrency(bill.totalAmount)}</td>
                      <td>
                        <span className={`status-badge status-${bill.status}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td>{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => navigate(`/bills/${bill._id}`)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-icon btn-download"
                            onClick={() => handleDownloadPDF(bill._id, bill.invoiceNumber)}
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                          {isAdmin() && (
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDelete(bill._id)}
                              title="Delete Bill"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Bills;
