import { assert } from 'chai';

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

						assert(role.id === testRole.id, 'id does not match');
						assert(role.name === testRole.name, 'name does not match');

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

						assert(roles[0].id === testRole.id, 'id does not match');
						assert(roles[0].name === testRole.name, 'name does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});
});
