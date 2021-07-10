import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { IRepositoryService } from '../index';

import { CacheService } from '../../../services/cache';

import { UserRole } from './model';

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
	public readUserRoles(where: FindConditions<UserRole> = {}, cached: boolean = false): Promise<UserRole[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('user-role', this.readUserRoles);
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
	public async saveUserRole(userRole: UserRole): Promise<UserRole> {
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
