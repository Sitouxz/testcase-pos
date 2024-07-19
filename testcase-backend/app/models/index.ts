import { Dialect, Sequelize } from 'sequelize';
import { InvoiceModel } from '../models/invoice.model';
import dbConfig from '../config/db.config';

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as Dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const Invoice = InvoiceModel(sequelize);

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

export { Invoice };

// Initialize the `db` object
const db: {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  invoices?: ReturnType<typeof InvoiceModel>;
} = {
  Sequelize: Sequelize,
  sequelize: sequelize
};

// Initialize models
db.invoices = InvoiceModel(sequelize);

export default db;
