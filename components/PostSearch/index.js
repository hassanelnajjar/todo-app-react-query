import React from 'react';

import { useTodosQuery } from '../../hooks/useTodosQuery';

const PostSearch = () => {
  const { data: posts, isLoading, isFetching } = useTodosQuery();
  const [activeId, setActiveId] = React.useState('');
  const searchById = (e) => {
    e.preventDefault();
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

export { PostSearch };
