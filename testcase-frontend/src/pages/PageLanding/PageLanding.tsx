import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice } from '../../actions/invoiceActions';
import { RootState } from '@/reducers';
import { TypeInvoice } from '../../actions/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ModalAddInvoice } from '@/components/ModalAddInvoice';

// Lazy load Navigation component
const Navigation = React.lazy(
  () => import('../../components/layouts/navigation')
);

export default function PageLanding() {
  const dispatch = useDispatch();
  const { invoices, loading, error, hasMore } = useSelector(
    (state: RootState) => state.invoices
  ) as {
    invoices: TypeInvoice[];
    loading: boolean;
    error: any;
    hasMore: boolean;
  };

  const [page, setPage] = useState(1);

  // Fetch invoices when page changes
  useEffect(() => {
    dispatch(getInvoice(page, 16) as any);
  }, [dispatch, page]);

  // Handle errors
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render loading indicator for the initial load
  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  // Render no invoices message
  if (!invoices || invoices.length === 0) {
    return <div>No invoices found.</div>;
  }

  // Load more invoices
  const fetchMoreData = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className='flex flex-col w-full min-h-screen'>
      <React.Suspense fallback={<div>Loading navigation...</div>}>
        <Navigation />
      </React.Suspense>
      <main className='flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-8'>
        <div className='self-end gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
          <ModalAddInvoice />
        </div>
        <InfiniteScroll
          dataLength={invoices.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div>Loading more...</div>}
          endMessage={<div>No more invoices to load.</div>}>
          <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
            {invoices.map((invoice: TypeInvoice) => (
              <div key={invoice.id}>
                <Card x-chunk='dashboard-01-chunk-0'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                    <CardTitle className='text-sm font-medium'>
                      Invoice #{invoice.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {invoice.customerName}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Customer: {invoice.customerName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Salesperson: {invoice.salespersonName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Notes: {invoice.notes}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </main>
    </div>
  );
}
