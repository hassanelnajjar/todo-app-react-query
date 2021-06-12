// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import todos from './todosDb';

export default async (req, res) => {
	await (() => {
		return new Promise((resolve) => setTimeout(resolve, 1000));
	})();

	const method = req.method;
	console.log(todos);
	if (method === 'GET') return res.status(200).json(todos);
	if (method === 'PATCH') {
		todos = [...todos.filter((todo) => todo.id !== req.body.id), req.body];
		res.status(200).json(todos);
	}
	if (method === 'POST') {
		todos.push(req.body);
		return res.status(200).json(todos);
	}
};
