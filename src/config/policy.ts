import acl from 'acl';
import { readFileSync } from 'fs';

const policy = new acl(new acl.memoryBackend());

// Read permissions from combined policies
const policies = JSON.parse(readFileSync('./dist/output/policies.combined.json', 'utf-8'));

policy.allow([
	{
		allows: policies.Admin,
		roles: ['Admin']
	},
	{
		allows: policies.User,
		roles: ['User']
	}
]);

export { policy };
