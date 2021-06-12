import { patch } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const editTodo = () => {
  const queryClient = useQueryClient();
  return useMutation((newTodo) => patch('/api/todos', newTodo), {
    onSuccess: async (newTodo) => {
      queryClient.invalidateQueries('todos');
      queryClient.invalidateQueries(['todo', newTodo.id]);
    },
  });
};

export { editTodo };
