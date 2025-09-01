import HeaderApp from "@/components/common/HeaderApp";
import Dashboard from "@/pages/Alumno/Dahboard"

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderApp />
      <Dashboard/>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}