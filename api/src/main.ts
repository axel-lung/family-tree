import express from 'express';
import { sequelize } from './config/database';
import { User } from './models/User';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});


async function bootstrap() {
  await sequelize.sync({ force: true }); // Crée les tables (force: true pour développement)
  console.log('Database synced');
  // Code Express existant
}

bootstrap();