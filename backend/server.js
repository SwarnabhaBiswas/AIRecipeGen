import dotenv from 'dotenv';

dotenv.config();

import express, { urlencoded } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pantryRoutes from './routes/pantry.js';
import recipeRoutes from './routes/recipes.js';
import mealPlanRoutes from './routes/mealPlans.js';
import shoppingListRoutes from './routes/shoppingList.js';

const app= express();

// Configure CORS for multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

app.get('/',(req,res)=>{
    res.json({message:'Get request'})
})

// Health check route to ping both Backend and DB
app.get('/health', async (req, res) => {
  try {
    // A simple query to ensure the DB connection is active
    await pool.query('SELECT 1'); 
    res.status(200).json({ status: 'OK', message: 'Backend and Database are awake' });
  } catch (err) {
    console.error('Health check failed', err);
    res.status(500).json({ status: 'Error', message: 'Database unreachable' });
  }
});


const PORT= process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`)
    console.log(`App is running on ${process.env.NODE_ENV || 'developement'}` )
})