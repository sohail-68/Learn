import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* Child routes yahan render honge */}
    </div>
  );
};

export default UserLayout;
