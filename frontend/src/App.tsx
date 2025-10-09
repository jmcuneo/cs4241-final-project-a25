import { useState } from "react";
import Layout from "./components/Layout";
import MealForm from "./components/MealForm";

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "meals">("home");

  const handlePageChange = (page: "home" | "meals") => {
    setCurrentPage(page);
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {currentPage === "meals" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Log Your Daily Meals
            </h2>
            <p className="text-gray-600 mb-6">
              Track your nutrition by logging the foods you eat throughout the
              day.
            </p>
            <MealForm />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
