import * as dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './config/database';
import { initModels } from './models';
import authRoutes from './routes/auth.routes';
import { redisClient } from './config/redis.config';
import cors from 'cors';
import personRoutes from './routes/person.routes';
import relationshipRoutes from './routes/relationship.routes';
import permissionRoutes from './routes/permission.routes';
import userRoutes from './routes/user.routes';
import shareRoutes from './routes/share.routes';
import familyRoutes from './routes/family.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Configuration CORS
const allowedOrigins = [
  'http://localhost',
  'http://localhost:4200',
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/families', familyRoutes);

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await redisClient.connect();
    initModels(); // Initialiser les relations
    await sequelize.sync({ force: false }); // Force: true pour développement, à retirer en production
    console.log('Database synced');
    app.listen(3333, () => {
  console.log(`Server running on http://localhost:${port}`);
});
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
