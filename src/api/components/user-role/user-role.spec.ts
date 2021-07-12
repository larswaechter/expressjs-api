import { assert, expect } from 'chai';

import { TestFactory } from '../../../test/factory';

import { UserRole } from './model';

describe('Testing user-role component', () => {
	const factory: TestFactory = new TestFactory();
	const testRole: UserRole = UserRole.mockTestUserRole();

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
					name: 'Admin'
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const role: UserRole = res.body;

						assert.isObject(role, 'userRole should be an object');

						expect(role.id).eq(testRole.id, 'id does not match');
						expect(role.name).eq(testRole.name, 'name does not match');

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

						const roles: UserRole[] = res.body;

						assert.isArray(roles, 'userRoles shoud be an array');

						expect(roles[0].id).eq(testRole.id, 'id does not match');
						expect(roles[0].name).eq(testRole.name, 'name does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});

		describe('GET /user-roles/1', () => {
			it('responds single user-role', (done) => {
				factory.app
					.get('/api/v1/user-roles/1')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						try {
							if (err) throw err;

							const role: UserRole = res.body;

							assert.isObject(role, 'userRole should be an object');

							expect(role.id).eq(testRole.id, 'id does not match');
							expect(role.name).eq(testRole.name, 'name does not match');

							return done();
						} catch (err) {
							return done(err);
						}
					});
			});
		});

		describe('DELETE /user-roles/1', () => {
			it('responds with status 204', (done) => {
				factory.app.delete('/api/v1/user-roles/1').set('Accept', 'application/json').expect(204, done);
			});

			it('responds with status 404', (done) => {
				factory.app.delete('/api/v1/user-roles/1').set('Accept', 'application/json').expect(404, done);
			});
		});
	});
});
