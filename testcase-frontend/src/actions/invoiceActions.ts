import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from '../utils/api'; // Adjust the import based on your structure
import { RootState } from '../reducers'; // Import RootState from the appropriate location
import {
  GET_INVOICES,
  ADD_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE,
  INVOICE_LOADING,
  GET_ERRORS,
  InvoiceActionTypes
} from './types';

export type ThunkActionResult = ThunkAction<
  void,
  RootState,
  unknown,
  InvoiceActionTypes
>;

export const getInvoice =
  (page: number, limit: number): ThunkActionResult =>
  async (dispatch: Dispatch) => {
    dispatch({ type: INVOICE_LOADING });

    try {
      const res = await api.get(
        page === 0 && limit === 0
          ? '/api/invoices?noPaginate=true'
          : `/api/invoices?page=${page}&limit=${limit}`
      );
      const hasMore = res.data.totalItems > page * limit; // Determine if there are more items

      dispatch({
        type: GET_INVOICES,
        payload: {
          invoices: res.data.invoices, // Array of invoices
          hasMore
        }
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_ERRORS,
        payload: { message: 'Failed to fetch invoices', error: err }
      });
    }
  };
// Add a new invoice
export const addInvoice =
  (invoice: any): ThunkActionResult =>
  (dispatch: Dispatch) => {
    dispatch({ type: INVOICE_LOADING });
    api
      .post('/api/invoices', invoice)
      .then((res) =>
        dispatch({
          type: ADD_INVOICE,
          payload: res.data
        })
      )
      .catch((err) => console.error(err)); // Handle errors as needed
  };

// Update an existing invoice
export const updateInvoice =
  (id: number, invoice: any): ThunkActionResult =>
  (dispatch: Dispatch) => {
    dispatch({ type: INVOICE_LOADING });
    api
      .put(`/api/invoices/${id}`, invoice)
      .then((res) =>
        dispatch({
          type: UPDATE_INVOICE,
          payload: res.data
        })
      )
      .catch((err) => console.error(err)); // Handle errors as needed
  };

// Delete an invoice
export const deleteInvoice =
  (id: number): ThunkActionResult =>
  (dispatch: Dispatch) => {
    api
      .delete(`/api/invoices/${id}`)
      .then(() =>
        dispatch({
          type: DELETE_INVOICE,
          payload: id
        })
      )
      .catch((err) => console.error(err)); // Handle errors as needed
  };
