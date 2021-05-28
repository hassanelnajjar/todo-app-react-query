// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import todos from './todosDb';

export default (req, res) => {
	const method = req.method;
	if (method === 'GET') return res.status(200).json(todos);
	if (method === 'POST') {
		todos.push(req.body);
		return res.status(200).json(todos);
	}
};
