import { post } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const addTodo = () => {
  const queryClient = useQueryClient();
  return useMutation((newTodo) => post('/api/todos', newTodo), {
    onSuccess: async () => {
      queryClient.invalidateQueries('todos');
    },
  });
};
export { addTodo };
