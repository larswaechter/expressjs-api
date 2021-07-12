import { assert } from 'chai';

import { TestFactory } from '../../../test/factory';

import { User } from '../user/model';

describe('Testing auth component', () => {
	const factory: TestFactory = new TestFactory();
	const testUser: User = new User('test@test.com', 'Peter', 'Griffin', '1234', true);

	let invitationUUID;

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
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

						assert.isString(uuid);

						invitationUUID = uuid;

						return done();
					} catch (err) {
						return done(err);
					}
				});
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

		it('responds with status 204', (done) => {
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
				.expect(204, done);
		});
	});
});
