import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/model';

@Entity()
export class UserRole {
	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		nullable: false,
		unique: true
	})
	public name: string;

	@OneToMany((type) => User, (user) => user.userRole)
	public users: User[];

	public static mockTestUserRole(): UserRole {
		return new UserRole(1, 'Admin');
	}
}
