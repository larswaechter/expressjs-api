import { expect, assert } from 'chai';

import { TestFactory } from '../../../test/factory';

import { User } from '../user/model';

describe('Testing auth component', () => {
	const factory: TestFactory = new TestFactory();
	const testUser: User = new User(1, 'peter@griffin.com', 'Peter', 'Griffin', '1234', true);

	let invitationUUID: string;

	before((done) => {
		factory.init().then(done);
	});

	after((done) => {
		factory.close().then(done);
	});

	describe('POST /auth/invite', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/auth/invite')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new invitation uuid', (done) => {
			factory.app
				.post('/api/v1/auth/invite')
				.send({
					email: testUser.email
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const uuid: string = res.body;

						assert.isString(uuid, 'uuid should be a string');

						invitationUUID = uuid;

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('POST /user-roles', () => {
		it('responds with new user-role', (done) => {
			factory.app
				.post('/api/v1/user-roles')
				.send({
					name: 'Admin'
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('POST /auth/register', () => {
		it('responds with status 403', (done) => {
			factory.app
				.post('/api/v1/auth/register/d20c47b2-e2ac-11eb-ba80-0242ac130004')
				.send({
					email: testUser.email,
					firstname: testUser.firstname,
					lastname: testUser.lastname,
					password: testUser.password,
					active: testUser.active
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(403, done);
		});

		it('responds with registered user', (done) => {
			factory.app
				.post(`/api/v1/auth/register/${invitationUUID}`)
				.send({
					email: testUser.email,
					firstname: testUser.firstname,
					lastname: testUser.lastname,
					password: testUser.password,
					active: testUser.active
				})
				.set('Accept', 'application/json')
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const user: User = res.body;

						assert.isObject(user, 'user should be an object');

						expect(user.id).eq(testUser.id, 'id does not match');
						expect(user.email).eq(testUser.email, 'email does not match');
						expect(user.firstname).eq(testUser.firstname, 'firstname does not match');
						expect(user.lastname).eq(testUser.lastname, 'lastname does not match');
						expect(user.active).eq(testUser.active, 'active does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('POST /auth/signin', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/auth/signin')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with status 401', (done) => {
			factory.app
				.post('/api/v1/auth/signin')
				.send({
					email: testUser.email,
					password: 'wrongpassword'
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(401, done);
		});

		it('responds with signed in user and token', (done) => {
			factory.app
				.post('/api/v1/auth/signin')
				.send({
					email: testUser.email,
					password: testUser.password
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { token, user } = res.body;

						assert.isString(token, 'token should be a string');
						assert.isObject(user, 'user should be an object');

						expect(user.id).eq(testUser.id, 'id does not match');
						expect(user.email).eq(testUser.email, 'email does not match');
						expect(user.firstname).eq(testUser.firstname, 'firstname does not match');
						expect(user.lastname).eq(testUser.lastname, 'lastname does not match');
						expect(user.active).eq(testUser.active, 'active does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});
});
