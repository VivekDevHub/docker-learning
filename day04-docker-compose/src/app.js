import express from 'express';
import morgan from 'morgan';
import indexRouter from './routes/index.routes.js';


const app = express();


app.use(morgan('dev'));
app.use(express.json());

app.use('/api', indexRouter);

export default app;