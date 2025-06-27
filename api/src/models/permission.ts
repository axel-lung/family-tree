import { DataTypes, Model } from 'sequelize';
   import { sequelize } from '../config/database';
   import { User } from './user';
   import { Person } from './person';

   export class Permission extends Model {
     public id!: number;
     public user_id!: number;
     public person_id!: number;
     public can_create!: boolean;
     public can_update!: boolean;
     public can_delete!: boolean;
     public created_at!: Date;
   }

   Permission.init(
     {
       id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: { model: 'users', key: 'id' },
       },
       person_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: { model: 'persons', key: 'id' },
       },
       can_create: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
       },
       can_investing_update: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
       },
       can_delete: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
       },
       created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
       },
     },
     {
       sequelize,
       modelName: 'Permission',
       tableName: 'permissions',
       timestamps: true,
     }
   );

   Permission.belongsTo(User, { foreignKey: 'user_id' });
   Permission.belongsTo(Person, { foreignKey: 'person_id' });