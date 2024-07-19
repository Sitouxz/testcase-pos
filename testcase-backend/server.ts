require('dotenv').config();
import express from 'express';
import cors from 'cors';
import db from './app/models';
import invoiceRoutes from './app/routes/invoice.routes';

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Change this to your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json()); // Express built-in JSON parser
app.use(express.urlencoded({ extended: true }));

// Sync the database
db.sequelize
  .sync({ alter: true }) // Drop and re-sync the database
  .then(() => {
    console.log('Drop and re-sync db.');
  })
  .catch((err: { message: string }) => {
    console.log('Failed to sync db: ' + err.message);
  });

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'widatech-pos backend' });
});

// Routes
app.use('/api/invoices', invoiceRoutes);

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
