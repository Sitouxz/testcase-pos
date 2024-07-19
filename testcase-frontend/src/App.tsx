// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import PageRevenueChart from './pages/PageRevenueChart/PageRevenueChart';
import PageLanding from './pages/PageLanding/PageLanding';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/revenue' Component={PageRevenueChart} />
            <Route path='/' Component={PageLanding} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
