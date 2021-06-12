import React from 'react';
import { get, patch } from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
const Post = () => {
	const { loading, todoItem, setTodoItem, setLoading, router } = useTodo();

	const editTodo = async (id, e) => {
		e.preventDefault();
		const title = e.target[0].value;
		const content = e.target[1].value;
		setLoading(true);
		await patch('/api/todos', { id, title, content });
		setLoading(false);
		router.push('/');
	};

	return (
		<>
			<p>Todo Content</p>
			<p>Todo : {todoItem.id}</p>

			<button style={{ display: 'block' }}>
				<Link href='/'>Home</Link>
			</button>
			{loading ? (
				'loading ...'
			) : (
				<form onSubmit={(e) => editTodo(todoItem.id, e)}>
					<input
						type='text'
						value={todoItem.title}
						onChange={(e) =>
							setTodoItem((todo) => ({ ...todo, title: e.target.value }))
						}
					/>
					<input
						type='text'
						value={todoItem.content}
						onChange={(e) =>
							setTodoItem((todo) => ({ ...todo, content: e.target.value }))
						}
					/>
					<input type='submit' value='Edit' />
				</form>
			)}
		</>
	);
};

export default Post;

const useTodo = () => {
	const router = useRouter();
	const [loading, setLoading] = React.useState(true);
	const [todoItem, setTodoItem] = React.useState({
		id: '',
		title: '',
		content: '',
	});

	React.useEffect(() => {
		(async () => {
			const { data: todos } = await get('/api/todos');
			const todo = todos.find((todo) => todo.id === router.query.id);
			setTodoItem(todo);
			setLoading(false);
		})();
	}, []);
	return {
		loading,
		todoItem,
		setTodoItem,
		setLoading,
		router,
	};
};
