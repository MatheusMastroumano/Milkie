import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('<h1>API rodando</h1>');
});

app.listen(port, () => {
    console.log(`API rodando em: http://localhost:${port}`);
});
