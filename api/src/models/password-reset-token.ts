import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

export class PasswordResetToken extends Model {
  public id!: number;
  public user_id!: number;
  public token!: string;
  public expires_at!: Date;
  public created_at!: Date;
}

PasswordResetToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'password_reset_tokens',
    timestamps: false,
  }
);