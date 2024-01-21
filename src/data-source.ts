import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Categoria } from './entity/Categoria';
import { Media } from './entity/Media';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: 'netflix',
	synchronize: true,
	logging: false,
	entities: [Categoria, Media],
	migrations: [],
	subscribers: []
});
