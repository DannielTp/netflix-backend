import { Request, Response } from 'express';
import { TemplateController } from './TemplateController';
import { AppDataSource } from '../data-source';
import { Media } from '../entity/Media';
import { In, SelectQueryBuilder } from 'typeorm';
import { Categoria } from '../entity/Categoria';

export class MediaController extends TemplateController {
	async find(req: Request, res: Response) {
		const { id, categoria } = req.query;

		const mediaRepository = AppDataSource.getRepository(Media);

		try {
			if (!id && !categoria) throw new Error('Id or category is required');

			let queryBuilder: SelectQueryBuilder<Media> =
				mediaRepository.createQueryBuilder('media');

			if (id) {
				queryBuilder = queryBuilder.where('media.id = :id', { id: Number(id) });
			} else {
				queryBuilder = queryBuilder
					.leftJoin('media.categorias', 'categoria')
					.andWhere('categoria.nombre IN (:...categorias)', {
						categorias: [categoria]
					});
			}

			const media = await queryBuilder.orderBy('media.id', 'ASC').getMany();

			res.status(200).json(media);
		} catch (error) {
			res.status(400).json({
				error: 'Error al obtener la peli/serie'
			});
		}
	}

	async create(req: Request, res: Response) {
		const {
			name,
			description,
			image,
			trailer,
			genres,
			episodes,
			seasons,
			year,
			categories
		} = await req.body;

		if (
			!name ||
			!description ||
			!image ||
			!trailer ||
			!genres ||
			!episodes ||
			!seasons ||
			!categories
		) {
			res.status(400).json({ error: 'Missing fields' });
			return;
		}

		const mediaRepository = AppDataSource.getRepository(Media);
		const categoriaRepository = AppDataSource.getRepository(Categoria);

		try {
			const existingCategories = await categoriaRepository.find({
				where: { nombre: In(categories) }
			});

			if (existingCategories.length !== categories.length)
				throw new Error('Invalid categories');

			let media = new Media(
				name,
				description,
				image,
				trailer,
				genres,
				episodes,
				seasons,
				undefined,
				year
			);

			await mediaRepository.save(media);

			const lastMedia = await mediaRepository.findOneOrFail({
				where: { nombre: name }
			});

			lastMedia.categorias = existingCategories;

			existingCategories.forEach(async (categoria) => {
				if (!categoria.media) categoria.media = [];

				categoria.media.push(lastMedia);
				await categoriaRepository.save(categoria);
			});

			await mediaRepository.save(lastMedia);

			res.status(201).json(media);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async update(req: Request, res: Response) {
		const { id, name, description, image, trailer, genres, episodes, seasons, year } =
			await req.body;

		if (!id) {
			res.status(400).json({ error: 'Id is required' });
			return;
		}

		const mediaRepository = AppDataSource.getRepository(Media);

		try {
			let media = await mediaRepository.findOneOrFail(id);

			if (name) media.nombre = name;
			if (description) media.descripcion = description;
			if (image) media.imagen = image;
			if (trailer) media.trailer = trailer;
			if (genres) media.generos = genres;
			if (episodes) media.episodios = episodes;
			if (seasons) media.temporadas = seasons;
			if (year) media.anhoPublicacion = year;

			await mediaRepository.save(media);

			res.status(201).json(media);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async delete(req: Request, res: Response) {
		const { id } = req.body;

		if (!id) {
			res.status(400).json({ error: 'Id is required' });
			return;
		}

		const mediaRepository = AppDataSource.getRepository(Media);

		try {
			const media = await mediaRepository.findOneOrFail(id);

			await mediaRepository.remove(media);

			res.status(200).json(media);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
