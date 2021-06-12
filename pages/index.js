import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Home } from '../components/Home';

const queryClient = new QueryClient();

const index = () => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);

export default index;
