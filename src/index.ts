import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json

// Define a simple route for GET requests to the home page
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
