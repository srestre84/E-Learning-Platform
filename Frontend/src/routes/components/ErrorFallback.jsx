const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-6 max-w-2xl mx-auto text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-red-800 mb-2">¡Algo salió mal!</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
);

export default ErrorFallback;
