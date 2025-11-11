const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  roomCharges: {
    type: Number,
    required: true,
    default: 0
  },
  foodCharges: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  taxPercentage: {
    type: Number,
    default: 18
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer'],
    default: 'cash'
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'cancelled'],
    default: 'paid'
  }
}, {
  timestamps: true
});

// Auto-generate invoice number
billSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last bill of the current month
    const lastBill = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastBill) {
      const lastSequence = parseInt(lastBill.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
