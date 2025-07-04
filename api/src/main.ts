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

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Configurer CORS pour autoriser les requêtes depuis le frontend
app.use(
  cors({
    origin: 'http://localhost:4200', // Autoriser uniquement cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    credentials: true, // Autoriser les cookies (si nécessaire, pour HttpOnly plus tard)
  })
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/permissions', permissionRoutes);
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
