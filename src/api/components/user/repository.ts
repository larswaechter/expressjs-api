import { bind } from 'decko';
import { getManager } from 'typeorm';

import { AbsRepository } from '../AbsRepository';
import { User } from './model';

export class UserRepository extends AbsRepository<User> {
	constructor() {
		super('user', getManager().getRepository(User), ['userRole']);
	}

	/**
	 * Read user by email from db
	 *
	 * @param email Email to search for
	 * @returns User
	 */
	@bind
	readByEmail(email: string): Promise<User> {
		try {
			return this.read({
				where: {
					email
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}
