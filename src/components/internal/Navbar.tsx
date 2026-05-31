import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="p-2 flex flex-col gap-2 w-[15%] bg-green-200">
      <b>Navbar</b>
      <Link to="/dashboard" className="[&.active]:font-bold">
        Dashboard
      </Link>{" "}
      <Link to="/sppg" className="[&.active]:font-bold">
        SPPG
      </Link>
      <Link to="/" className="[&.active]:font-bold">
        Logout
      </Link>
    </div>
  );
};

export default Navbar;
