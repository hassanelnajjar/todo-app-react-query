/* eslint-disable react/prop-types */
import React from 'react';
import { useTodoQuery, editTodo as editTodoHook } from '../../hooks';
import { TodoForm } from '../TodoForm';

const PostComponent = ({ id }) => {
  const { data: todoItem, isLoading: loading, isFetching } = useTodoQuery(id);
  const mutation = editTodoHook();

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
            <>
              <TodoForm editTodo={editTodo} formData={todoItem} />
              <p>Edit Status : {mutation.status}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export { PostComponent };
