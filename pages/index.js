import React from 'react';
import { post, get } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

const Posts = ({ posts }) => {
	return posts.map(({ title, content, id }) => (
		<div>
			<Link href={'/post/' + id} key={id}>
				<div style={{ cursor: 'pointer' }}>
					<span>Title: {title}</span>
					<span>----</span>
					<span>Content: {content}</span>
				</div>
			</Link>
		</div>
	));
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

const Home = () => {
	const { posts, loading, setPosts, setLoading } = useTodos();
	// const { posts, loading, setPosts, setLoading } = useTodosContext();
	return (
		<>
			<h1>Posts</h1>
			{loading ? (
				'loading ...'
			) : (
				<>
					<PostCount></PostCount>
					<Posts posts={posts}></Posts>
				</>
			)}

			<Post setPosts={setPosts} setLoading={setLoading}></Post>
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
	const { refetch, posts, loading, setPosts, setLoading } = useTodosContext();
	React.useEffect(() => {
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

	const refetch = () => {
		if (!activePromise.current) {
			activePromise.current = (async () => {
				const { data: posts } = await get('/api/todos');
				setPosts(posts);
				setLoading(false);
			})();
		}
		return activePromise.current;
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
