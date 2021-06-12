import { get } from 'axios';
import { useQuery } from 'react-query';

const useTodoQuery = (id) =>
  useQuery(['todo', id], () => get(`/api/todo/${id}`).then((res) => res.data));

export { useTodoQuery };
