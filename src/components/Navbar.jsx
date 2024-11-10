import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              PlantID
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link to="/gallery" className="text-gray-600 hover:text-green-600">
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
