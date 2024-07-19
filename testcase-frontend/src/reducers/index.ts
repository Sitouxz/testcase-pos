import { combineReducers } from 'redux';
import invoiceReducer from './invoiceReducer';

const rootReducer = combineReducers({
  invoices: invoiceReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
