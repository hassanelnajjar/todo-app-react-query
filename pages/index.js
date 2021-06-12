/* eslint-disable react/prop-types */
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
  const { data: posts, isFetching, isLoading } = useTodosQuery();
  return isLoading ? (
    'loading....'
  ) : (
    <>
      {isFetching
        ? 'updating...'
        : React.Children.toArray(
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
          )}
    </>
  );
};
const Post = () => {
  const mutation = useMutation((newTodo) => post('/api/todos', newTodo), {
    onSuccess: async () => {
      queryClient.invalidateQueries('todos');
    },
  });
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
  const { data: posts, isLoading, isFetching } = useTodosQuery();
  const [activeId, setActiveId] = React.useState('');
  const searchById = (e) => {
    e.preventDefault();
    // const id = e.target[0].value;
    // const result = posts.filter((post) => post.id === id);
    // setSearchResult(result);
    setActiveId(e.target[0].value);
  };

  return (
    <form onSubmit={searchById}>
      <label htmlFor="">
        Search By Id
        <input type="search" />
        <div style={{ minHeight: '10vh', border: '1px solid red' }}>
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              {isFetching
                ? 'updating...'
                : React.Children.toArray(
                    posts
                      .filter((post) => post.id === activeId)
                      .map((post) => <p>{post.content}</p>)
                  )}
            </>
          )}
        </div>
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
  const { data: todoItem, isLoading: loading, isFetching } = useTodoQuery(id);
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
        <>
          {isFetching ? (
            'updating...'
          ) : (
            <TodoForm editTodo={editTodo} formData={todoItem} />
          )}
        </>
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
