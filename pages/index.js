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
const Post = ({ setPosts }) => {
	const submitButton = async (e) => {
		e.preventDefault();
		const { data: posts } = await post('/api/todos', {
			id: uuidv4(),
			title: e.target[0].value,
			content: e.target[1].value,
		});
		setPosts(posts);
	};
	return (
		<form onSubmit={submitButton}>
			<input placeholder='title' type='text' />
			<input placeholder='content' type='text' />
			<input type='submit' value='submit' />
		</form>
	);
};
const Home = () => {
	const [posts, setPosts] = React.useState([]);
	React.useEffect(() => {
		(async () => {
			const { data: posts } = await get('/api/todos');
			setPosts(posts);
		})();
	}, []);
	return (
		<>
			<h1>Posts</h1>
			<p>Posts Count: {posts.length}</p>
			<Posts posts={posts}></Posts>
			<Post setPosts={setPosts}></Post>
		</>
	);
};

export default Home;
