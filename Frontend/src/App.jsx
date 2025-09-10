import { Suspense, useCallback } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  const handleLogout = useCallback(() => {
    // La redirección se manejará a través del router
    return '/authentication';
  }, []);
  
  return (
    <AuthProvider onLogout={handleLogout}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Cargando...
          </div>
        }>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
