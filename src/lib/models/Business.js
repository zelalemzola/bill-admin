// models/Business.js
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  bannerImageUrl: {
    type: String,
    
  },
  bannerImageKey: {
    type: String,
    
  },
  locations: [LocationSchema],
  details: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
