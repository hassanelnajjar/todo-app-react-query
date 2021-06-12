import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const deleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newTodo) =>
      axios.delete(`/api/todo/${newTodo.id}`, { data: { id: newTodo.id } }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('todos');
      },
    }
  );
};
export { deleteTodo };
