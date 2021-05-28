import React from 'react';
import { get } from 'axios';
import { useRouter } from 'next/router';

const Post = (props) => {
	const router = useRouter();
	const [todoItem, setTodoItem] = React.useState({ title: '', content: '' });

	const editTodo = async (e) => {
		e.preventDefault();
		
	};

	React.useEffect(() => {
		(async () => {
			const { data: todos } = await get('/api/todos');
			const todo = todos.find((todo) => todo.id === router.query.id);
			setTodoItem(todo);
		})();
	}, []);
	return (
		<form onSubmit={editTodo}>
			<p>Todo Content</p>
			<input type='text' value={todoItem.title} />
			<input type='text' value={todoItem.content} />
			<button type='submit' />
		</form>
	);
};

export default Post;
