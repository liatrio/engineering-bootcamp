import { useState } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AppProviders, createQueryClient } from './providers';
import { routes } from './router';

const router = createBrowserRouter(routes);

export function App() {
  const [client] = useState(createQueryClient);
  return (
    <AppProviders client={client}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
