import MealForm from "./components/MealForm";

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://react.dev" target="_blank"></a>
      </div>
      <div className="flex flex-col justify-between items-center mb-8">
        <div className=""></div>
        <h1 className="font-bold text-4xl text-green-700">
          Track your calories
        </h1>
      </div>
      <div className="mb-8">
        <MealForm />
      </div>
    </>
  );
}

export default App;
