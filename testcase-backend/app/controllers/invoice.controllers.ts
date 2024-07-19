import { Request, Response } from 'express';
import { Invoice } from '../models/invoice.model';

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, noPagination } = req.query;

    // Check if noPagination is set to true or a specific value
    const shouldPaginate = !noPagination;

    const options: any = {
      // Default pagination options
      limit: shouldPaginate ? Number(limit) : undefined,
      offset: shouldPaginate ? (Number(page) - 1) * Number(limit) : undefined
    };

    const { count, rows } = await Invoice.findAndCountAll(options);

    // If noPagination is true, we don’t need to include totalItems
    res.status(200).json({
      ...(shouldPaginate ? { totalItems: count } : {}),
      invoices: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoices', error });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoice', error });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create invoice', error });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const [updated] = await Invoice.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedInvoice = await Invoice.findByPk(req.params.id);
      res.status(200).json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update invoice', error });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const deleted = await Invoice.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice', error });
  }
};
