import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '10.0.0.6',
  username: 'admin', // Remplace par tes identifiants MySQL
  password: 'Pq=%aBx@qZ_21_mysql', // Remplace par ton mot de passe
  database: 'family_tree',
});