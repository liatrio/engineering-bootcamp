export function ServiceMissing() {
  return (
    <div className="alert alert-info" role="status">
      <p>
        <strong>
          The Assignments service isn&apos;t running yet — you&apos;ll build it in Chapter 3.3.
        </strong>
      </p>
      <p>
        Once <code>assignments-service</code> is up behind the proxy at{' '}
        <code>/api/assignments</code>, this page works with no changes.
      </p>
    </div>
  );
}
