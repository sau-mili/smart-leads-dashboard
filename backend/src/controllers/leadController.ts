// backend/src/controllers/leadController.ts
import { Request, Response } from 'express';
import Lead from '../models/Lead';

// Create a new lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      res.status(400).json({ success: false, message: 'Lead with this email already exists' });
      return;
    }

    const lead = await Lead.create({ name, email, status, source });
    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all leads (Now with Search, Filter, Sort, and Pagination!)
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Grab everything the frontend is asking for
    const { status, source, search, sort, page = '1' } = req.query;
    
    // 2. Build the database query
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    
    // Search both name and email (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 3. Pagination Setup (Set to 2 for testing, normally 10)
    const limit = 2; 
    const pageNumber = parseInt(page as string, 10) || 1;
    const skip = (pageNumber - 1) * limit;

    // 4. Sorting Setup
    const sortOption: any = sort === 'Oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // 5. Execute the query
    const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limit);
    const total = await Lead.countDocuments(query);

    // 6. Send the perfectly sliced data back to React
    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limit)
      },
      data: leads
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Lead Analytics/Stats
export const getLeadStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    res.status(200).json({
      success: true,
      data: { 
        totalLeads, 
        newLeads, 
        qualifiedLeads, 
        lostLeads 
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};