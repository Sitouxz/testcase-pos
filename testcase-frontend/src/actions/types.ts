// Invoice action types
export const GET_INVOICES = 'GET_INVOICE';
export const ADD_INVOICE = 'ADD_INVOICE';
export const DELETE_INVOICE = 'DELETE_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const INVOICE_LOADING = 'INVOICE_LOADING';
export const INVOICE_ERROR = 'INVOICE_ERROR';

// Error action types
export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Combine action types
export type InvoiceActionTypes =
  | GetInvoicesSuccessAction
  | { type: typeof ADD_INVOICE; payload: any }
  | { type: typeof DELETE_INVOICE; payload: number }
  | { type: typeof UPDATE_INVOICE; payload: any }
  | { type: typeof INVOICE_LOADING }
  | { type: typeof GET_ERRORS; payload: any };

export type TypeInvoice = {
  id: number;
  customerName: string;
  salespersonName: string;
  total: number;
  notes: string;
};
export interface InvoiceState {
  invoices: TypeInvoice[]; // Directly an array
  loading: boolean;
  error: any;
  hasMore: boolean;
}

export interface GetInvoicesSuccessAction {
  type: typeof GET_INVOICES;
  payload: {
    invoices: TypeInvoice[]; // Directly an array
    hasMore: boolean; // Add this
  };
}
