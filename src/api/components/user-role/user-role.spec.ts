import { assert } from 'chai';

import { TestFactory } from '../../../test/factory';

import { UserRole } from './model';

describe('Testing user-role component', () => {
	const factory: TestFactory = new TestFactory();
	const testUserRole: UserRole = UserRole.mockTestUserRole();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /user-roles', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/user-roles')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new user-role', (done) => {
			factory.app
				.post('/api/v1/user-roles')
				.send({
					userRole: { name: 'Admin' }
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const userRole: UserRole = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert userRole
						assert.isObject(userRole, 'userRole should be an object');
						assert(userRole.id === testUserRole.id, 'userRoleID does not match');
						assert(userRole.name === testUserRole.name, 'userRoleName does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /user-roles', () => {
		it('responds with user-role array', (done) => {
			factory.app
				.get('/api/v1/user-roles')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const userRoles: UserRole[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert userRoles
						assert.isArray(userRoles, 'userRoles shoud be an array');
						assert(userRoles[0].id === testUserRole.id, 'userRoleID does not match');
						assert(userRoles[0].name === testUserRole.name, 'userRoleName does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});
});
