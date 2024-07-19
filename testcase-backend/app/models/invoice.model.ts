// invoice.model.ts
import { Sequelize, DataTypes, Model } from 'sequelize';

export class Invoice extends Model {
  public id!: number;
  public date!: Date;
  public customerName!: string;
  public salespersonName!: string;
  public paymentType!: string;
  public notes?: string;
  public products!: Array<{
    name: string;
    picture: string;
    stock: number;
    price: number;
    quantity: number;
  }>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function InvoiceModel(sequelize: Sequelize) {
  Invoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salespersonName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paymentType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Invoice'
    }
  );

  return Invoice;
}
