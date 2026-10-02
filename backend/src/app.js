import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);

app.get('/health', (req, res) => {
    console.log('server is healthy');
    res.send('Server is healthy');
});

export default app;