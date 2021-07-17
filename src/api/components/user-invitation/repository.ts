import { getManager } from 'typeorm';

import { AbsRepository } from '../AbsRepository';
import { UserInvitation } from './model';

export class UserInvitationRepository extends AbsRepository<UserInvitation> {
	constructor() {
		super('user-invitation', getManager().getRepository(UserInvitation));
	}
}
