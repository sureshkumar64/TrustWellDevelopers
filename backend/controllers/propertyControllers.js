import Property from '../models/Property.js';

// @desc Add a new property (Admin only)
export const addProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add property', error: err.message });
  }
};

// @desc Get all properties with optional filters (public homepage)
export const getAllProperties = async (req, res) => {
  try {
    const { location, type, condition, priceMin, priceMax, reraNumber } = req.query;
    const query = {};

    if (location) query.location = location;
    if (type) query.type = type;
    if (condition) query.condition = condition;
    if (reraNumber) query.reraNumber = reraNumber;
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Error fetching properties', error: err.message });
  }
};


// @desc Get property detail by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving property', error: err.message });
  }
};

// @desc Delete property by ID (Admin only)
export const deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete property', error: err.message });
  }
};
// @desc Update property by ID (Admin only)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const updated = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
