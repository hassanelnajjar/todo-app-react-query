/* eslint-disable react/button-has-type */
import React from 'react';
import { PostComponent } from '../PostComponent';
import { Posts } from '../Posts';
import { Post } from '../Post';
import { PostCount } from '../PostCount';
import { PostSearch } from '../PostSearch';
import { useTodosQuery } from '../../hooks/useTodosQuery';

const Home = () => {
  const [id, setId] = React.useState('');
  const { isLoading: loading } = useTodosQuery();

  return (
    <>
      <button onClick={() => setId('')}>Posts</button>
      <PostCount />
      <PostSearch />
      {loading ? (
        'loading ...'
      ) : (
        <>
          {id ? (
            <PostComponent id={id} />
          ) : (
            <>
              <Posts setId={setId} />
              <Post />
            </>
          )}
        </>
      )}
    </>
  );
};

export { Home };
