import React from 'react';

const Posts = ({ posts }) => {
	return posts.map(({ title, content }) => <li key={Date.now()}>{content}</li>);
};
const Post = ({ setPosts }) => {
	const submitButton = (e) => {
		e.preventDefault();
		console.log(e.target[0].value, e.target[1].value);
		setPosts((posts) => [
			...posts,
			{ title: e.target[0].value, content: e.target[1].value },
		]);
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
