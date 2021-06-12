/* eslint-disable react/button-has-type */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { post, get, patch } from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient();

const useTodosQuery = () =>
  useQuery('todos', () => get('/api/todos').then((res) => res.data));

const useTodoQuery = (id) =>
  useQuery('todo', () => get(`/api/todo/${id}`).then((res) => res.data));

const Posts = ({ setId }) => {
  const { data: posts, status } = useTodosQuery();
  return status === 'success'
    ? React.Children.toArray(
        posts.map(({ title, content, id }) => (
          <div>
            <div onClick={() => setId(id)} style={{ cursor: 'pointer' }}>
              <span>
                Title:
                {title}
              </span>
              <span>----</span>
              <span>
                Content:
                {content}
              </span>
            </div>
          </div>
        ))
      )
    : 'loading....';
};
const Post = () => {
  const mutation = useMutation((newTodo) => post('/api/todos', newTodo));
  const submitButton = async (e) => {
    e.preventDefault();
    mutation.mutate({
      id: uuidv4(),
      title: e.target[0].value,
      content: e.target[1].value,
    });
  };
  return (
    <form onSubmit={submitButton}>
      <input placeholder="title" type="text" />
      <input placeholder="content" type="text" />
      <input type="submit" value="submit" />
    </form>
  );
};

const PostCount = () => {
  const { data: posts, isLoading } = useTodosQuery();
  return isLoading ? (
    'loading ...'
  ) : (
    <p>
      Posts Count:
      {posts.length}
    </p>
  );
};

const PostSearch = () => {
  const [searchResult, setSearchResult] = React.useState([]);
  const { data: posts } = useTodosQuery();

  const searchById = (e) => {
    e.preventDefault();
    const id = e.target[0].value;
    const result = posts.filter((post) => post.id === id);
    setSearchResult(result);
  };

  return (
    <form onSubmit={searchById}>
      <label htmlFor="">
        Search By Id
        <input type="search" />
        <details>
          {React.Children.toArray(
            searchResult.map((post) => <p>{post.content}</p>)
          )}
        </details>
      </label>
    </form>
  );
};

const Home = () => {
  const [id, setId] = React.useState('');
  const { isLoading: loading } = useTodosQuery();

  return (
    <>
      <button onClick={() => setId('')}>Posts</button>
      <PostCount />
      <PostSearch />
      {loading ? (
        'loading ...'
      ) : (
        <>
          {id ? (
            <PostComponent id={id} />
          ) : (
            <>
              <Posts setId={setId} />
              <Post />
            </>
          )}
        </>
      )}
    </>
  );
};

const index = () => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);

export default index;

const PostComponent = ({ id }) => {
  const { data: todoItem, isLoading: loading } = useTodoQuery(id);
  const queryClient = useQueryClient();

  const mutation = useMutation((newTodo) => patch('/api/todos', newTodo), {
    onSuccess: async () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const editTodo = (todoId, e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const content = e.target[1].value;
    mutation.mutate({ id: todoId, title, content });
  };
  return (
    <div style={{ border: '1px solid black' }}>
      <p>Todo Content</p>
      <p>Todo :{loading ? '' : todoItem.id}</p>
      {loading ? (
        'loading ...'
      ) : (
        <TodoForm editTodo={editTodo} formData={todoItem} />
      )}
    </div>
  );
};

const TodoForm = ({
  formData = { id: '', title: '', content: '' },
  editTodo,
}) => {
  const [todoItem, setTodoItem] = React.useState({ ...formData });
  React.useEffect(() => {
    setTodoItem({ ...formData });
  }, [formData]);

  return (
    <form onSubmit={(e) => editTodo(todoItem.id, e)}>
      <input
        type="text"
        value={todoItem.title}
        onChange={(e) =>
          setTodoItem((todo) => ({
            ...todo,
            title: e.target.value,
          }))
        }
      />
      <input
        type="text"
        value={todoItem.content}
        onChange={(e) =>
          setTodoItem((todo) => ({
            ...todo,
            content: e.target.value,
          }))
        }
      />
      <input type="submit" value="Edit" />
    </form>
  );
};
