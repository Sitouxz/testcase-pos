import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { TypeInvoice } from '@/actions/types';
import { RootState } from '@/reducers';
import { getInvoice } from '../../actions/invoiceActions';

// Lazy load Navigation component
const Navigation = React.lazy(
  () => import('../../components/layouts/navigation')
);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Extract and aggregate data
const extractData = (invoices: any[]) => {
  return invoices.flatMap((invoice) =>
    invoice.products.map((product: any) => ({
      date: invoice.date,
      // totalPrice is sum of all product.price * product.stock
      totalPrice: product.price * product.stock
    }))
  );
};

const aggregateRevenue = (data: any[], period: 'day' | 'week' | 'month') => {
  const aggregated: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekNumber = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-W${weekNumber}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!aggregated[key]) {
      aggregated[key] = 0;
    }
    aggregated[key] += item.totalPrice;
  });

  return {
    labels: Object.keys(aggregated),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(aggregated),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        fill: false
      }
    ]
  };
};

// Chart data and options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<'line'>) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += `${context.parsed.y.toLocaleString()}`;
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Date'
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10
      }
    },
    y: {
      title: {
        display: true,
        text: 'Revenue ($)'
      },
      ticks: {
        callback: function (value: string | number) {
          return value.toLocaleString();
        }
      }
    }
  }
};

const PageRevenueChart: React.FC = () => {
  const dispatch = useDispatch();
  const { invoices } = useSelector((state: RootState) => state.invoices) as {
    invoices: TypeInvoice[];
    loading: boolean;
    error: any;
    hasMore: boolean;
  };
  const [chartData, setChartData] = useState<any>(
    aggregateRevenue(extractData(invoices), 'day')
  );
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    setChartData(aggregateRevenue(extractData(invoices), timeFrame));
  }, [invoices, timeFrame]);

  useEffect(() => {
    dispatch(getInvoice(0, 0) as any);
  }, [dispatch]);

  return (
    <div>
      <React.Suspense fallback={<div>Loading navigation...</div>}>
        <Navigation />
      </React.Suspense>
      <div className='flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-8'>
        <h2>Revenue Over Time</h2>
        <div className='flex gap-4'>
          <Button
            onClick={() => setTimeFrame('day')}
            variant={timeFrame === 'day' ? 'default' : 'outline'}>
            Daily
          </Button>
          <Button
            onClick={() => setTimeFrame('week')}
            variant={timeFrame === 'week' ? 'default' : 'outline'}>
            Weekly
          </Button>
          <Button
            onClick={() => setTimeFrame('month')}
            variant={timeFrame === 'month' ? 'default' : 'outline'}>
            Monthly
          </Button>
        </div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PageRevenueChart;
