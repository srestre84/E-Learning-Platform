import { Suspense } from 'react';
import ErrorBoundary from '@/ui/common/ErrorBoundary';
import LoadingFallback from './LoadingFallback';
import ErrorFallback from './ErrorFallback';

const LazyComponent = ({ component: Component, ...props }) => (
  <ErrorBoundary fallback={ErrorFallback}>
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

export default LazyComponent;
