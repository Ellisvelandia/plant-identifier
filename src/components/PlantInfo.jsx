function PlantInfo({ info, image }) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={image}
            alt="Uploaded plant"
          />
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900">{info.name}</h2>
          <p className="mt-1 text-gray-500 italic">{info.scientificName}</p>
          <p className="mt-4 text-gray-600">{info.description}</p>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900">Care Instructions:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {info.care.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantInfo;
