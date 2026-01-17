import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Users_Families extends Model {
    public user_id!: number;
    public family_id!: number;
}

Users_Families.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    family_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'families', key: 'id' },
    },
},
  {
    sequelize,
    modelName: 'Users_Families',
    tableName: 'users_families',
    timestamps: false,
  }
);