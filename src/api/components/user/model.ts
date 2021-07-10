import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, ManyToOne } from 'typeorm';

import { UserRole } from '../user-role/model';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		nullable: false,
		unique: true
	})
	public email: string;

	@Column()
	public firstname: string;

	@Column()
	public lastname: string;

	@Column({
		select: false
	})
	public password: string;

	@Column({
		default: true
	})
	public active: boolean;

	@CreateDateColumn()
	public created: Timestamp;

	@ManyToOne((type) => UserRole, (userRole) => userRole.users)
	public userRole: UserRole;

	public static mockTestUser(): User {
		const user = new User();

		user.id = 1;
		user.email = 'test@email.com';
		user.firstname = 'testFirstname';
		user.lastname = 'testLastName';
		user.password = 'testPassword';

		return user;
	}
}
