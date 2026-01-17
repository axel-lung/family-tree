import * as dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './config/database';
import { initModels } from './models';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import personRoutes from './routes/person.routes';
import relationshipRoutes from './routes/relationship.routes';
import permissionRoutes from './routes/permission.routes';
import userRoutes from './routes/user.routes';
import shareRoutes from './routes/share.routes';
import familyRoutes from './routes/family.routes';
import usersFamiliesRoutes from './routes/users-families.routes';

dotenv.config();

const app = express();
const port: number = 3333;
if (!port) {
  throw new Error('PORT environment variable is not set or not a valid number');
}


// Configuration CORS
const allowedOrigins = [
  process.env.FRONTEND_URL!,
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

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/users-families', usersFamiliesRoutes);

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    initModels(); // Initialiser les relations
    await sequelize.sync({ force: false }); // Force: true pour développement, à retirer en production
    console.log('Database synced');
    app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
