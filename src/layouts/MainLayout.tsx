import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
