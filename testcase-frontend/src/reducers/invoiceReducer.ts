// reducers/invoiceReducer.ts

import {
  GET_INVOICES,
  ADD_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE,
  INVOICE_LOADING,
  GET_ERRORS,
  InvoiceActionTypes,
  InvoiceState
} from '../actions/types';

const initialState: InvoiceState = {
  invoices: [],
  loading: false,
  error: null,
  hasMore: true
};

export default function invoiceReducer(
  state = initialState,
  action: InvoiceActionTypes
): InvoiceState {
  switch (action.type) {
    case INVOICE_LOADING:
      return { ...state, loading: true };
    case GET_INVOICES:
      return {
        ...state,
        loading: false,
        invoices: [...state.invoices, ...action.payload.invoices], // Concatenate arrays
        hasMore: action.payload.hasMore
      };
    case ADD_INVOICE:
      return {
        ...state,
        loading: false,
        invoices: [action.payload, ...state.invoices]
      };
    case DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(
          (invoice) => invoice.id !== action.payload
        )
      };
    case UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };
    case GET_ERRORS:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}
