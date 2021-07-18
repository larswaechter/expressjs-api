import { assert, expect } from 'chai';

import { TestFactory } from '../../../test/factory';

import { UserInvitation } from './model';

describe('Testing user-invitation component', () => {
	const factory: TestFactory = new TestFactory();
	const testInvitation: UserInvitation = UserInvitation.mockTestUserInvitation();

	before((done) => {
		factory.init().then(done);
	});

	after((done) => {
		factory.close().then(done);
	});

	describe('POST /user-invitations', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/user-invitations')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new user-invitations', (done) => {
			factory.app
				.post('/api/v1/user-invitations')
				.send({
					email: testInvitation.email,
					uuid: testInvitation.uuid,
					active: testInvitation.active
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const invitation: UserInvitation = res.body;

						assert.isObject(invitation, 'userInvitation should be an object');

						expect(invitation.id).eq(testInvitation.id, 'id does not match');
						expect(invitation.email).eq(testInvitation.email, 'email does not match');
						expect(invitation.uuid).eq(testInvitation.uuid, 'uuid does not match');
						expect(invitation.active).eq(testInvitation.active, 'active does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /user-invitations', () => {
		it('responds with user-invitations array', (done) => {
			factory.app
				.get('/api/v1/user-invitations')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const invitations: UserInvitation[] = res.body;

						assert.isArray(invitations, 'invitations shoud be an array');

						expect(invitations[0].id).eq(testInvitation.id, 'id does not match');
						expect(invitations[0].email).eq(testInvitation.email, 'email does not match');
						expect(invitations[0].uuid).eq(testInvitation.uuid, 'uuid does not match');
						expect(invitations[0].active).eq(testInvitation.active, 'active does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /user-invitations/1', () => {
		it('responds with user-invitation', (done) => {
			factory.app
				.get('/api/v1/user-invitations/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const invitation: UserInvitation = res.body;

						assert.isObject(invitation, 'invitations shoud be an object');

						expect(invitation.id).eq(testInvitation.id, 'id does not match');
						expect(invitation.email).eq(testInvitation.email, 'email does not match');
						expect(invitation.uuid).eq(testInvitation.uuid, 'uuid does not match');
						expect(invitation.active).eq(testInvitation.active, 'active does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});
});
