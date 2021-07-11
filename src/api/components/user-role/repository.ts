import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { CacheService } from '../../../services/cache';

import { UserRole } from './model';
import { IRepositoryService } from '../index';

export class UserRoleRepository implements IRepositoryService<UserRole> {
	readonly cacheService: CacheService = new CacheService();

	readonly repo: Repository<UserRole> = getManager().getRepository(UserRole);

	/**
	 * Read all user roles from db
	 *
	 * @param where Find conditions
	 * @param cached Read user roles from cache
	 * @returns Returns an array of user roles
	 */
	@bind
	public readAll(where: FindConditions<UserRole> = {}, cached: boolean = false): Promise<UserRole[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('user-role', this.readAll);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user-role to db
	 *
	 * @param user User-role to save
	 * @returns Returns saved user-role
	 */
	@bind
	public async save(userRole: UserRole): Promise<UserRole> {
		try {
			const newUserRole: UserRole = await this.repo.save(userRole);

			// Clear user cache
			this.cacheService.delete('user-role');

			return newUserRole;
		} catch (err) {
			throw new Error(err);
		}
	}
}
