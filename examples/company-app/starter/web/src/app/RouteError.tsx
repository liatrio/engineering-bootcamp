import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

/** One error screen for every route. */
export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main id="main" className="route-error">
      <h1>{notFound ? 'Page not found' : 'Something went wrong'}</h1>
      <p>
        <Link to="/employees">Back to Employees</Link>
      </p>
    </main>
  );
}
