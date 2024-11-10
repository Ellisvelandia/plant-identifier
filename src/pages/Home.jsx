import { useState } from "react";
import { Upload, Loader } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ImageUpload from "../components/ImageUpload";
import PlantInfo from "../components/PlantInfo";
import { getGeminiAPI } from "../config/api";

function Home() {
  const [image, setImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Image = reader.result;
        setImage(base64Image);

        // Initialize API with key from environment variables
        const genAI = new GoogleGenerativeAI(getGeminiAPI());

        // Update to use gemini-1.5-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt =
          "Analyze this plant image and provide: 1) Common name, 2) Scientific name, 3) Brief description, 4) Basic care instructions (watering, sunlight, soil)";

        const imageParts = [
          {
            inlineData: {
              data: base64Image.split(",")[1],
              mimeType: "image/jpeg",
            },
          },
        ];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        const plantData = {
          name: "Sample Plant",
          scientificName: "Plantus Exampleus",
          description: text,
          care: ["Water regularly", "Indirect sunlight", "Well-draining soil"],
          image: base64Image,
        };

        setPlantInfo(plantData);

        // Save to localStorage
        const savedPlants =
          JSON.parse(localStorage.getItem("savedPlants")) || [];
        savedPlants.push(plantData);
        localStorage.setItem("savedPlants", JSON.stringify(savedPlants));
      };
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error identifying plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Identify Your Plants
        </h1>
        <p className="mt-2 text-gray-600">
          Upload a photo to learn more about your plant
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <ImageUpload onUpload={handleImageUpload} />
        {loading && (
          <div className="text-center mt-8">
            <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto" />
            <p className="mt-2 text-gray-600">Analyzing your plant...</p>
          </div>
        )}
        {plantInfo && <PlantInfo info={plantInfo} image={image} />}
      </div>
    </div>
  );
}

export default Home;
