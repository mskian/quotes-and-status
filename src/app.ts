import express, { Application, Request, Response } from 'express';
import quoteRoutes from './routes/statusRoutes';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 6027;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));
app.use('/api/status', quoteRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
