import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UtilityService } from '../../../services/utility';

@Entity()
export class UserInvitation {
	constructor(id: number, email: string, hash: string, active: boolean) {
		this.id = id;
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
		return new UserInvitation(1, 'test@email.com', UtilityService.generateUuid(), true);
	}
}
