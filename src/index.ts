import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import { categoriasRouter } from './route/categorias';
import { mediaRouter } from './route/media';

(async () => {
	await AppDataSource.initialize();
})();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	})
);

app.use((req: Request, res: Response, next: NextFunction) => {
	// TODO: Verify token

	// TODO: Verify permissions
	// POST PATCH DELETE -> ADMIN
	// GET -> USER

	next();
});

app.use('/categorias', categoriasRouter);
app.use('/media', mediaRouter);

app.use((req: Request, res: Response) => {
	res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3030;
app.disable('x-powered-by');
app.listen(PORT, () => {
	console.info(`Server is running on port ${PORT}`);
});
