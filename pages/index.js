import React from 'react';
import { post, get, patch } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Posts = ({ setId }) => {
	const { posts } = useTodos();
	console.log('Posts', posts);
	return React.Children.toArray(
		posts.map(({ title, content, id }) => (
			<div>
				<div onClick={() => setId(id)} style={{ cursor: 'pointer' }}>
					<span>Title: {title}</span>
					<span>----</span>
					<span>Content: {content}</span>
				</div>
			</div>
		))
	);
};
const Post = ({ setPosts, setLoading }) => {
	const submitButton = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { data: posts } = await post('/api/todos', {
			id: uuidv4(),
			title: e.target[0].value,
			content: e.target[1].value,
		});
		setPosts(posts);
		setLoading(false);
	};
	return (
		<form onSubmit={submitButton}>
			<input placeholder='title' type='text' />
			<input placeholder='content' type='text' />
			<input type='submit' value='submit' />
		</form>
	);
};

const PostCount = () => {
	const { posts, loading } = useTodosContext();
	return loading ? 'loading ...' : <p>Posts Count: {posts.length}</p>;
};

const PostSearch = () => {
	const [searchResult, setSearchResult] = React.useState([]);
	const { posts } = useTodosContext();
	const searchById = (e) => {
		e.preventDefault();
		const id = e.target[0].value;
		const result = posts.filter((post) => post.id === id);
		setSearchResult(result);
	};

	return (
		<form onSubmit={searchById}>
			<label htmlFor=''>
				Search By Id
				<input type='search' />
				<details>
					{searchResult.map((post) => (
						<p>{post.content}</p>
					))}
				</details>
			</label>
		</form>
	);
};

const Home = () => {
	const [id, setId] = React.useState('');
	const { loading, setPosts, setLoading } = useTodos();
	return (
		<>
			<button onClick={() => setId('')}>Posts</button>
			<PostCount></PostCount>
			<PostSearch></PostSearch>
			{loading ? (
				'loading ...'
			) : (
				<>
					{id ? (
						<PostComponent id={id}></PostComponent>
					) : (
						<>
							<Posts setId={setId}></Posts>
							<Post setPosts={setPosts} setLoading={setLoading}></Post>
						</>
					)}
				</>
			)}
		</>
	);
};

const index = () => {
	return (
		<Provider>
			<Home />
		</Provider>
	);
};

export default index;

const useTodos = () => {
	console.log('useTodos');
	const { refetch, posts, loading, setPosts, setLoading } = useTodosContext();
	React.useEffect(() => {
		console.log('useEffect - useTodos');
		refetch();
	}, []);
	return {
		posts,
		loading,
		setPosts,
		setLoading,
	};
};

const context = React.createContext();

const Provider = ({ children }) => {
	const [posts, setPosts] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const activePromise = React.useRef(false);

	console.log('provider render');
	console.log('posts provider', posts);

	const refetch = () => {
		(async () => {
			const { data: posts } = await get('/api/todos');
			setPosts(posts);
			setLoading(false);
		})();
		// console.log('invoke refetch ...');
		// if (!activePromise.current) {
		// 	activePromise.current = (async () => {
		// 		const { data: posts } = await get('/api/todos');
		// 		setPosts(posts);
		// 		setLoading(false);
		// 	})();
		// }
		// return activePromise.current;
	};

	const contextValue = React.useMemo(() => ({
		posts,
		loading,
		setPosts,
		setLoading,
		refetch,
	}));
	return <context.Provider value={contextValue}>{children}</context.Provider>;
};

const useTodosContext = () => React.useContext(context);

const PostComponent = ({ id }) => {
	const { loading, todoItem, setTodoItem, setLoading } = useTodo(id);
	const editTodo = async (id, e) => {
		e.preventDefault();
		const title = e.target[0].value;
		const content = e.target[1].value;
		setLoading(true);
		await patch('/api/todos', { id, title, content });
		setLoading(false);
	};

	return (
		<div style={{ border: '1px solid black' }}>
			<p>Todo Content</p>
			<p>Todo : {todoItem.id}</p>
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
		</div>
	);
};

const useTodo = (id) => {
	const [loading, setLoading] = React.useState(true);
	const [todoItem, setTodoItem] = React.useState({
		id: '',
		title: '',
		content: '',
	});

	React.useEffect(() => {
		(async () => {
			const { data: todos } = await get('/api/todos');
			const todo = todos.find((todo) => todo.id === id) || [];
			setTodoItem(todo);
			setLoading(false);
		})();
	}, []);

	return {
		loading,
		todoItem,
		setTodoItem,
		setLoading,
	};
};
