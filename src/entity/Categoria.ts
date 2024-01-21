import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './Media';

@Entity('categorias')
export class Categoria {
	constructor(nombre: string, activo?: boolean) {
		this.nombre = nombre;
		this.activo = activo;
	}

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column('varchar', { nullable: false })
	nombre: string;

	@Column('boolean', { nullable: false, default: true })
	activo: boolean;

	@ManyToMany((type) => Media, (media) => media.categorias)
	@JoinTable({ name: 'categoria_media' })
	media: Media[];
}
