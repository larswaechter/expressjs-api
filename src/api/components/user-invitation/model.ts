import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserInvitation {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		nullable: false,
		unique: true
	})
	public email: string;

	@Column({
		nullable: false,
		unique: true
	})
	public hash: string;

	@Column({
		default: true
	})
	public active: boolean;
}
