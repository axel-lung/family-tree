import { DataTypes, Model } from 'sequelize';
   import { sequelize } from '../config/database';

   export class Relationship extends Model {
     public id!: number;
     public person1_id!: number;
     public person2_id!: number;
     public relationship_type!: 'parent' | 'child' | 'spouse';
     public created_at!: Date;
   }

   Relationship.init(
     {
       id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       person1_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: { model: 'persons', key: 'id' },
       },
       person2_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: { model: 'persons', key: 'id' },
       },
       relationship_type: {
         type: DataTypes.ENUM('parent', 'child', 'spouse'),
         allowNull: false,
       },
       created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
       },
     },
     {
       sequelize,
       modelName: 'Relationship',
       tableName: 'relationships',
       timestamps: false,
     }
   );