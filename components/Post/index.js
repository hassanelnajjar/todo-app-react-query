import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addTodo } from '../../hooks';

const Post = () => {
  const mutation = addTodo();
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

export { Post };
