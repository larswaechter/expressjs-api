import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

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
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userRoles: UserRole[] = await this.repo.readAll({}, true);
			return res.json(userRoles);
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
	 * @returns Returns HTTP response
	 */
	@bind
	public async createUserRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ error: errors.array() });
			}

			const { name } = req.body;

			const role = new UserRole(name);
			const newRole: UserRole = await this.repo.save(role);

			return res.json(newRole);
		} catch (err) {
			return next(err);
		}
	}
}
