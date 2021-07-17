import { getManager } from 'typeorm';

import { AbsRepository } from '../helper';

import { UserRole } from './model';

export class UserRoleRepository extends AbsRepository<UserRole> {
	constructor() {
		super('user-role', getManager().getRepository(UserRole));
	}
}
