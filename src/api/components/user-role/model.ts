import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/model';

@Entity()
export class UserRole {
	constructor(name: string) {
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
		const userRole: UserRole = new UserRole('Admin');
		userRole.id = 1;

		return userRole;
	}
}
