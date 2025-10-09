import { useState, useEffect } from "react";

interface Food {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
}

function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/foods/search?q=salmon")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFoods(data.foods || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://react.dev" target="_blank"></a>
      </div>
      <div className="flex flex-col justify-between items-center">
        <div className=""></div>
        <h1 className="font-bold text-4xl text-amber-700">
          Track your calories
        </h1>
      </div>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">First 10 Foods</h2>
        {loading ? (
          <p>Loading foods...</p>
        ) : (
          <div className="space-y-4">
            {foods.slice(0, 10).map((food, index) => (
              <div
                key={food.fdcId || index}
                className="border p-4 rounded hover:border-orange-500"
              >
                <h3 className="font-semibold text-lg">{food.description}</h3>
                <p className="text-sm text-gray-600">
                  Brand: {food.brandOwner || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Data Type: {food.dataType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
