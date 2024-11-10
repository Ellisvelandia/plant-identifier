import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Chat from "../components/Chat";

function Gallery() {
  const [savedPlants, setSavedPlants] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const loadPlants = () => {
      const plants = JSON.parse(localStorage.getItem("savedPlants")) || [];
      setSavedPlants(plants);
    };

    loadPlants();
    // Add event listener for storage changes
    window.addEventListener("storage", loadPlants);
    return () => window.removeEventListener("storage", loadPlants);
  }, []);

  const deletePlant = (index) => {
    const updatedPlants = savedPlants.filter((_, i) => i !== index);
    setSavedPlants(updatedPlants);
    localStorage.setItem("savedPlants", JSON.stringify(updatedPlants));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Plant Gallery</h1>
        {savedPlants.length > 0 && (
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {showChat ? "Close Chat" : "Ask About Plants"}
          </button>
        )}
      </div>

      {savedPlants.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>
            No plants in your gallery yet. Start by identifying some plants!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlants.map((plant, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden relative group"
            >
              <button
                onClick={() => deletePlant(index)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Delete plant"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {plant.name}
                </h2>
                <p className="mt-1 text-gray-500 italic">
                  {plant.scientificName}
                </p>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {plant.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showChat && (
        <Chat plants={savedPlants} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}

export default Gallery;
