import Lead from '../models/lead.js';

// @desc Save contact form lead
export const createContactLead = async (req, res) => {
  try {
    const { name, phone, message, propertyId, propertyData } = req.body;

    const lead = new Lead({
      type: 'contact',
      name,
      phone,
      message,
      propertyId,
      propertyData: propertyData || null
    });

    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating contact lead' });
  }
};

// @desc Save user-submitted property
export const createUserPropertyLead = async (req, res) => {
  try {
    const { name, phone, message, propertyData } = req.body;

    const lead = new Lead({
      type: 'user_property',
      name,
      phone,
      message,
      propertyData: {
        ...propertyData,
        reraNumber: propertyData?.reraNumber || '' // ✅ Handle optional RERA number safely
      }
    });

    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error('Error saving property lead:', err);
    res.status(500).json({ success: false, message: 'Error saving property lead' });
  }
};

// @desc Get all leads (admin only)
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .populate('propertyId'); // Populate full property info if linked

    res.status(200).json(leads);
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

// @desc Delete a lead by ID (admin only)
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error });
  }
};
