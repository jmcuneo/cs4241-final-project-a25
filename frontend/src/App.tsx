import MealForm from "./components/MealForm";

function App() {
  return (
    <>
      <div className="flex flex-col justify-between items-center w-screen h-full max-h-screen">
        <h1 className="font-bold text-4xl text-green-700">
          Track your calories
        </h1>
        <MealForm />
      </div>
    </>
  );
}

export default App;
