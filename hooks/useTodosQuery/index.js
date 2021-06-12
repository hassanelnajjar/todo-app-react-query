import { get } from 'axios';
import { useQuery } from 'react-query';

const useTodosQuery = () =>
  useQuery('todos', () => get('/api/todos').then((res) => res.data));

export { useTodosQuery };
