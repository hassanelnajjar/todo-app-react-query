/* eslint-disable react/prop-types */
import React from 'react';

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

export { TodoForm };
