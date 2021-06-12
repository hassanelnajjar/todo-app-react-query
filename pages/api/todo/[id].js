import todos from '../todosDb';

export default async (req, res) => {
  await (() => new Promise((resolve) => setTimeout(resolve, 1000)))();
  const { method } = req;
  const { id } = req.query;
  if (method === 'GET')
    return res.status(200).json(todos.find((todo) => todo.id === id));
  if (method === 'DELETE') {
    todos = todos.filter((todo) => todo.id !== req.body.id);
    console.log('body', req.body, 'body');
    return res.status(200).json(todos);
  }
};
