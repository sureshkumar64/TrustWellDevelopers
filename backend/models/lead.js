import mongoose from 'mongoose';
const propertyDataSchema = new mongoose.Schema({
  title: String,
  location: String,
  type: String,
  condition: String,
  price: Number,
  whatsappNumber: String,
  images: [
    {
      url: String,
      title: String,
      description: String
    }
  ]
}, { _id: false });

const leadSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['contact', 'user_property'],
    required: true
  },
  name: String,
  phone: String,
  message: String,
  propertyData: propertyDataSchema,
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);