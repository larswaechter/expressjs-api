import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, ManyToOne } from 'typeorm';

import { UserRole } from '../user-role/model';

@Entity()
export class User {
	constructor(email: string, firstname: string, lastname: string, password: string, active: boolean) {
		this.email = email;
		this.firstname = firstname;
		this.lastname = lastname;
		this.password = password;
		this.active = active;
	}

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
		const user = new User('test@email.com', 'testFirstname', 'testLastname', 'testPassword', true);
		user.id = 1;
		user.userRole = new UserRole(1, 'Admin');
		return user;
	}
}
