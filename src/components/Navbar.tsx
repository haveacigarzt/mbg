import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="p-2 flex flex-col gap-2 w-[15%] bg-green-200">
      <b>Navbar</b>
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/dashboard" className="[&.active]:font-bold">
        Login
      </Link>
    </div>
  );
};

export default Navbar;
