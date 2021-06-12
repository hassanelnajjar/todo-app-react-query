import { useTodosQuery } from '../../hooks/useTodosQuery';

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

export { PostCount };
