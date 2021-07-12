import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UtilityService } from '../../../services/utility';

@Entity()
export class UserInvitation {
	constructor(email: string, hash: string, active: boolean) {
		this.email = email;
		this.uuid = hash;
		this.active = active;
	}

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
	public uuid: string;

	@Column({
		default: true
	})
	public active: boolean;

	public static mockTestUserInvitation(): UserInvitation {
		const userInvitation: UserInvitation = new UserInvitation('test@email.com', UtilityService.generateUuid(), true);
		userInvitation.id = 1;
		return userInvitation;
	}
}
