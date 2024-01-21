import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from './Categoria';

@Entity('media')
export class Media {
	constructor(
		nombre: string,
		descripcion: string,
		imagen: string,
		trailer: string,
		generos: string[],
		episodios: number,
		temporadas: number,
		categorias?: Categoria[],
		anhoPublicacion?: number
	) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.imagen = imagen;
		this.trailer = trailer;
		this.generos = generos;
		this.episodios = episodios;
		this.temporadas = temporadas;
		this.categorias = categorias;
		this.anhoPublicacion = anhoPublicacion;
	}

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column('varchar', { nullable: false })
	nombre: string;

	@Column('varchar', { nullable: false })
	descripcion: string;

	@Column('varchar', { nullable: false })
	imagen: string;

	@Column('varchar', { nullable: false })
	trailer: string;

	@Column('text', { nullable: false })
	generos: string[];

	@Column('int', { nullable: false })
	episodios: number;

	@Column('int', { nullable: false })
	temporadas: number;

	@Column('int', { nullable: false, default: new Date().getFullYear() })
	anhoPublicacion: number;

	@ManyToMany((type) => Categoria, (categoria) => categoria.media)
	@JoinTable({ name: 'categoria_media' })
	categorias: Categoria[];
}
