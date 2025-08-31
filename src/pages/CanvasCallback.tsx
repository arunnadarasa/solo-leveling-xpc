import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CanvasCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (window.opener) {
      if (error) {
        window.opener.postMessage({
          type: 'CANVAS_AUTH_ERROR',
          error: error,
          state: state
        }, window.location.origin);
      } else if (code) {
        window.opener.postMessage({
          type: 'CANVAS_AUTH_SUCCESS',
          code: code,
          state: state
        }, window.location.origin);
      }
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Processing Canvas authentication...</p>
      </div>
    </div>
  );
};

export default CanvasCallback;