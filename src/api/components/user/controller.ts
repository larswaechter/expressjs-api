import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '../../../services/utility';

import { User } from './model';
import { UserRepository } from './repository';

export class UserController {
	private readonly userRepo: UserRepository = new UserRepository();

	/**
	 * Read users
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const users: User[] = await this.userRepo.readAll({}, true);

			return res.json({ status: res.statusCode, data: users });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read users by username
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUsersByUsername(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { username } = req.query;

			const users: User[] = await this.userRepo.readUsersByUsername(username as string);

			return res.json({ status: res.statusCode, data: users });
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
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					id: parseInt(userID, 10)
				}
			});

			return res.json({ status: res.statusCode, data: user });
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
	 * @returns Returns HTTP response
	 */
	@bind
	public async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { user } = req.body;

			if (!user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const existingUser: User | undefined = await this.userRepo.read({
				where: {
					email: user.email
				}
			});

			// Email is already taken
			if (existingUser) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			const newUser: User = await this.userRepo.save({
				...user,
				password: await UtilityService.hashPassword(user.password)
			});

			return res.json({ status: res.statusCode, data: newUser });
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
	 * @returns Returns HTTP response
	 */
	@bind
	public async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;
			let { user } = req.body;

			if (!userID || !req.body.user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const existingUser: User | undefined = await this.userRepo.read({
				where: {
					id: parseInt(userID, 10)
				}
			});

			if (!existingUser) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			if (user.password) {
				user = {
					...user,
					password: await UtilityService.hashPassword(user.password)
				};
			}

			const updatedUser: User = await this.userRepo.save(user);

			return res.json({ status: res.statusCode, data: updatedUser });
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
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					id: parseInt(userID, 10)
				}
			});

			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			await this.userRepo.delete(user);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
