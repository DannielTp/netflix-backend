import { Request, Response } from 'express';
import { TemplateController } from './TemplateController';
import { AppDataSource } from '../data-source';
import { Categoria } from '../entity/Categoria';

export class CategoriasController extends TemplateController {
	async find(req: Request, res: Response) {
		const { id, name } = req.query;

		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			if (!id && !name) throw new Error('Id or name is required');

			const categoria = await categoriaRepository.findOneOrFail({
				where: id ? { id: Number(id) } : { nombre: name as string },
				order: { id: 'ASC' }
			});

			res.status(200).json(categoria);
		} catch (error) {
			res.status(400).json({ error: 'Error al obtener la categoria' });
		}
	}

	async findAll(req: Request, res: Response) {
		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			const categorias = await categoriaRepository.find({ order: { id: 'ASC' } });
			res.status(200).json(categorias);
		} catch (error) {
			res.status(400).json({ error: 'Error al obtener las categorias' });
		}
	}

	async create(req: Request, res: Response) {
		const { name, active } = await req.body;
		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			if (!name) throw new Error('Name is required');

			let categoria = new Categoria(name, active);

			await categoriaRepository.save(categoria);

			res.status(201).json(categoria);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async update(req: Request, res: Response) {
		const { id, name, active } = await req.body;
		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			let categoria = await categoriaRepository.findOneOrFail(id);

			categoria.nombre = name;
			categoria.activo = active;

			await categoriaRepository.save(categoria);

			res.status(200).json(categoria);
		} catch (error) {
			res.status(400).json(error);
		}
	}

	async delete(req: Request, res: Response) {
		const { id } = await req.body;
		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			let categoria = await categoriaRepository.findOneOrFail(id);
			await categoriaRepository.remove(categoria);

			res.status(200).json({ deleted: true });
		} catch (error) {
			res.status(400).json({ deleted: false });
		}
	}
}
