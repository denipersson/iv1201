import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import personRoutes from './routes/personRoutes';
import path from 'path';
import * as dotenv from 'dotenv';



const app: Express = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Person routes
app.use('/api/person', personRoutes);
app.use('/api/login', personRoutes);


// Specific routes for serving HTML pages
app.get('/registration', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'registration.html'));
 });
 app.get('/login', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'login.html'));
 });

 // 
 app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
