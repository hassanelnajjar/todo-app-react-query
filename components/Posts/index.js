/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import { useTodosQuery, deleteTodo } from '../../hooks';

const Posts = ({ setId }) => {
  const { data: posts, isFetching, isLoading } = useTodosQuery();
  const { mutate } = deleteTodo();
  return isLoading ? (
    'loading....'
  ) : (
    <>
      {isFetching
        ? 'updating...'
        : React.Children.toArray(
            posts.map(({ title, content, id }) => (
              <div>
                <div>
                  <span>
                    Title:
                    {title}
                  </span>
                  <span>----</span>
                  <span>
                    Content:
                    {content}
                  </span>
                  <button
                    type="button"
                    onClick={() => setId(id)}
                    style={{ cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => mutate({ id })}
                    style={{ cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
    </>
  );
};

export { Posts };
