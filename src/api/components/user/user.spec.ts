import { assert } from 'chai';

import { TestFactory } from '../../../test/factory';

import { User } from './model';

describe('Testing user component', () => {
	const factory: TestFactory = new TestFactory();
	const testUser: User = User.mockTestUser();
	const testUserModified: User = { ...testUser, firstname: 'testFirstnameModified', lastname: 'testLastnameModified' };

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /users', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/users')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new user', (done) => {
			factory.app
				.post('/api/v1/users')
				.send({
					user: testUser
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const user: User = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert user
						assert.isObject(user, 'user should be an object');
						for (const k in testUser) {
							if (k !== 'password') {
								assert(testUser[k as keyof User] === user[k as keyof User], `key ${k} does not match`);
							}
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('PUT /users/1', () => {
		it('responds with updated user', (done) => {
			factory.app
				.put('/api/v1/users/1')
				.send({
					user: testUserModified
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const user: User = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert user
						assert.isObject(user, 'user should be an object');
						for (const k in testUserModified) {
							if (k !== 'password') {
								assert(testUserModified[k as keyof User] === user[k as keyof User], `key ${k} does not match`);
							}
						}
						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /users', () => {
		it('responds with user array', (done) => {
			factory.app
				.get('/api/v1/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const users: User[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert users
						assert.isArray(users, 'users should be an array');
						for (const k in testUserModified) {
							if (k !== 'password') {
								assert(testUserModified[k as keyof User] === users[0][k as keyof User], `key ${k} does not match`);
							}
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /users/1', () => {
		it('responds with single user', (done) => {
			factory.app
				.get('/api/v1/users/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const user: User = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert user
						assert.isObject(user, 'user should be an object');
						for (const k in testUserModified) {
							if (k !== 'password') {
								assert(testUserModified[k as keyof User] === user[k as keyof User], `key ${k} does not match`);
							}
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /users/search', () => {
		it('responds with user array', (done) => {
			factory.app
				.get('/api/v1/users')
				.query({ username: 'testFirstnameModified testLastnameModified' })
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const users: User[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert users
						assert.isArray(users, 'users should be an array');
						for (const k in testUserModified) {
							if (k !== 'password') {
								assert(testUserModified[k as keyof User] === users[0][k as keyof User], `key ${k} does not match`);
							}
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('DELETE /users/1', () => {
		it('responds with status 204', (done) => {
			factory.app.delete('/api/v1/users/1').set('Accept', 'application/json').expect(204, done);
		});

		it('responds with status 404', (done) => {
			factory.app.delete('/api/v1/users/1').set('Accept', 'application/json').expect(404, done);
		});
	});
});
