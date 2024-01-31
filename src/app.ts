import express, { Application } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import userRoutes from './routes/userRoutes';
import queryRoutes from './routes/queryRoutes';


const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// API routes
app.use('/api', userRoutes);
app.use('/api', queryRoutes);

// Specific routes for serving HTML pages
app.get('/addUser', (req, res) => {
   // console.log('Serving addUser.html');
    res.sendFile(path.join(__dirname, 'public', 'addUser.html'));
});
app.get('/queries', (req, res) => {
    //console.log('Serving queries.html');
    res.sendFile(path.join(__dirname, 'public', 'queries.html'));
});


// Catch-all route for SPA or fallback
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
