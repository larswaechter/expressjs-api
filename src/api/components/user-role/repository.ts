import { getManager } from 'typeorm';

import { AbsRepository } from '../AbsRepository';
import { UserRole } from './model';

export class UserRoleRepository extends AbsRepository<UserRole> {
	constructor() {
		super('user-role', getManager().getRepository(UserRole));
	}
}
