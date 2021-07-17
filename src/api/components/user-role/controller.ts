import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserRole } from './model';
import { UserRoleRepository } from './repository';

export class UserRoleController {
	private readonly repo: UserRoleRepository = new UserRoleRepository();

	/**
	 * Read user roles
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userRoles: UserRole[] = await this.repo.readAll({}, true);
			return res.json(userRoles);
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
	async readUserRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { roleID } = req.params;

			const userRole: UserRole | undefined = await this.repo.read({
				where: {
					id: +roleID
				}
			});

			return res.json(userRole);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user role
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async createUserRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { name } = req.body;

			const role = new UserRole(undefined, name);
			const newRole: UserRole = await this.repo.save(role);

			return res.json(newRole);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete user role
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async deleteUserRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { roleID } = req.params;

			const userRole: UserRole | undefined = await this.repo.read({
				where: {
					id: +roleID
				}
			});

			if (!userRole) {
				return res.status(404).json({ error: 'User role not found' });
			}

			await this.repo.delete(userRole);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
