import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Family extends Model {
  public id!: number;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Family.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Family',
    tableName: 'families',
    timestamps: false,
  }
);
