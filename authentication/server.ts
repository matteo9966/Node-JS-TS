import dotenv from 'dotenv';
import e from 'express';

const app = e();
app.use(e.json());

//now i must create the db connection