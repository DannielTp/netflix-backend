import { MediaController } from '../controller/media';
import { Router } from 'express';

export const mediaRouter = Router();
const mediaController = new MediaController();

mediaRouter.get('/', mediaController.find);
mediaRouter.post('/', mediaController.create);
mediaRouter.patch('/', mediaController.update);
mediaRouter.delete('/', mediaController.delete);
