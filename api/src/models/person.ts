import { DataTypes, Model } from 'sequelize';
   import { sequelize } from '../config/database';
   import { User } from './user';

   export class Person extends Model {
     public id!: number;
     public user_id!: number | null;
     public first_name!: string;
     public last_name!: string;
     public birth_date!: Date | null;
     public birth_place!: string | null;
     public death_date!: Date | null;
     public biography!: string | null;
     public email!: string | null;
     public phone!: string | null;
     public residence!: string | null;
     public photo_url!: string | null;
     public deleted!: boolean;
     public created_at!: Date;
     public updated_at!: Date;
   }

   Person.init(
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
       first_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       last_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       birth_date: {
         type: DataTypes.DATE,
         allowNull: true,
       },
       birth_place: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       death_date: {
         type: DataTypes.DATE,
         allowNull: true,
       },
       biography: {
         type: DataTypes.TEXT,
         allowNull: true,
       },
       email: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       phone: {
         type: DataTypes.STRING(20),
         allowNull: true,
       },
       residence: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       photo_url: {
         type: DataTypes.STRING(255),
         allowNull: true,
       },
       deleted: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
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
       modelName: 'Person',
       tableName: 'persons',
       timestamps: false,
     }
   );

   Person.belongsTo(User, { foreignKey: 'user_id' });