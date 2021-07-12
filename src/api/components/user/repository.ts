import { bind } from 'decko';
import { Like, Repository, FindConditions, getManager, FindManyOptions, FindOneOptions } from 'typeorm';

import { CacheService } from '../../../services/cache';

import { IRepositoryServiceStrict } from '../index';

import { User } from './model';

export class UserRepository implements IRepositoryServiceStrict<User> {
	readonly defaultRelations: string[] = ['userRole'];
	readonly cacheService: CacheService = new CacheService();
	readonly repo: Repository<User> = getManager().getRepository(User);

	/**
	 * Read all users from db
	 *
	 * @param options Find options
	 * @param cached Use cache
	 * @returns Users array
	 */
	@bind
	public readAll(options: FindManyOptions<User> = {}, cached: boolean = false): Promise<User[]> {
		try {
			if (Object.keys(options).length) {
				return this.repo.find({
					relations: this.defaultRelations,
					...options
				});
			}

			/*
			if (cached) {
				return this.cacheService.get('user', this.readAll);
			}
			*/

			return this.repo.find({
				relations: this.defaultRelations
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read user by email from db
	 *
	 * @param email Email to search for
	 * @returns User
	 */
	@bind
	public readByEmail(email: string): Promise<User> {
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

	/**
	 * Read a certain user from db
	 *
	 * @param options Find options
	 * @returns User
	 */
	@bind
	public read(options: FindOneOptions<User> = {}): Promise<User | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user to db
	 *
	 * @param user User to save
	 * @returns Saved user
	 */
	@bind
	public async save(user: User): Promise<User> {
		try {
			const newUser: User = await this.repo.save(user);

			// Clear user cache
			this.cacheService.delete('user');

			return newUser;
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete user from db
	 *
	 * @param user User to delete
	 * @returns Deleted user
	 */
	@bind
	public async delete(user: User): Promise<User> {
		try {
			const deletedUser = await this.repo.remove(user);

			this.cacheService.delete('user');

			return deletedUser;
		} catch (err) {
			throw new Error(err);
		}
	}
}
