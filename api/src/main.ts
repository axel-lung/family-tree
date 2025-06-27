import * as dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './config/database';
import { initModels } from './models';
import authRoutes from './routes/auth.routes';
import { redisClient } from './config/redis.config';
import cors from 'cors';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(cors({ origin: 'http://localhost:4200' }));

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await redisClient.connect();
    initModels(); // Initialiser les relations
    await sequelize.sync({ force: true }); // Force: true pour développement, à retirer en production
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
