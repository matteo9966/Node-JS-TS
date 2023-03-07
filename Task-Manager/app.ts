import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { taskRouter } from './routes/tasks.router';

dotenv.config();

const app = express();
app.use(express.json())


app.use('/api/v1/tasks',taskRouter);

app.listen(5000,()=>{
    console.log('listeing on port 5000');
})
