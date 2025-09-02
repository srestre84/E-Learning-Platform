import  Sidebar from "@/components/common/Sidebar";
import HeaderApp from "@/components/common/HeaderApp"

import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1" >
      <HeaderApp />

      <main className="flex-1 p-6">
        <Outlet/>
        </main>
      </div>

    </div>
  );
}
