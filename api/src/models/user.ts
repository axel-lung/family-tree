import { DataTypes, Model } from 'sequelize';
   import { sequelize } from '../config/database';

   export class User extends Model {
     public id!: number;
     public email!: string;
     public password!: string;
     public role!: 'admin' | 'family_member' | 'guest';
     public created_at!: Date;
     public updated_at!: Date;
   }

   User.init(
     {
       id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       email: {
         type: DataTypes.STRING(255),
         unique: true,
         allowNull: false,
       },
       password: {
         type: DataTypes.STRING(255),
         allowNull: false,
       },
       role: {
         type: DataTypes.ENUM('admin', 'family_member', 'guest'),
         defaultValue: 'guest',
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
       modelName: 'User',
       tableName: 'users',
       timestamps: true,
     }
   );