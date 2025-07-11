import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  description: String,
});

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  type: { type: String, enum: ['Flat', 'Plot'] },
  condition: { type: String, enum: ['New', 'Old'] },
  price: Number,
  reraNumber: { type: String, default: '' },

  // ✅ New fields based on property type
  carpetArea: {
    type: String,
    required: function () {
      return this.type === 'Flat';
    },
  },
  possessionStatus: {
    type: String,
    default: '',
  },
  plotArea: {
    type: String,
    required: function () {
      return this.type === 'Plot';
    },
  },

  images: [imageSchema],
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Property', propertySchema);
