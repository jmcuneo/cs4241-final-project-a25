import MealForm from "../components/MealForm";

export default function MealLoggingPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Log your meals</h1>
        <p className="text-sm text-gray-600">
          Log your daily meals and track your nutrition
        </p>
      </header>
      <MealForm />
    </div>
  );
}
