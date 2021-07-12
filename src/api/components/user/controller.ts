import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '../../../services/utility';

import { User } from './model';
import { UserRepository } from './repository';

export class UserController {
	private readonly repo: UserRepository = new UserRepository();

	/**
	 * Read users
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const users: User[] = await this.repo.readAll({}, true);

			return res.json(users);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			const user: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user by email
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async readUserByEmail(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.query;

			const user: User = await this.repo.readByEmail(email as string);

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, firstname, lastname, password, active } = req.body;

			const existingUser: User | undefined = await this.repo.read({
				where: {
					email
				}
			});

			if (existingUser) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			const user: User = new User(
				undefined,
				email,
				firstname,
				lastname,
				await UtilityService.hashPassword(password),
				active
			);
			const newUser: User = await this.repo.save(user);

			return res.json(newUser);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;
			const { email, firstname, lastname, password, active } = req.body;

			if (!userID) {
				return res.status(400).json({ error: 'Invalid request' });
			}

			const existingUser: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			if (!existingUser) {
				return res.status(404).json({ error: 'User not found' });
			}

			existingUser.email = email;
			existingUser.firstname = firstname;
			existingUser.lastname = lastname;
			existingUser.password = await UtilityService.hashPassword(password);
			existingUser.active = active;

			const updatedUser: User = await this.repo.save(existingUser);

			return res.json(updatedUser);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			const user: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			await this.repo.delete(user);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
