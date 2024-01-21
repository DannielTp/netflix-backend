import { Router } from 'express';
import { CategoriasController } from '../controller/categorias';

export const categoriasRouter = Router();
const categoriasController = new CategoriasController();
categoriasRouter.get('/', categoriasController.find);
categoriasRouter.get('/all', categoriasController.findAll);
categoriasRouter.post('/', categoriasController.create);
categoriasRouter.patch('/', categoriasController.update);
categoriasRouter.delete('/', categoriasController.delete);
