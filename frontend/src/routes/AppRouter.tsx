import { Router, Switch, Route } from "wouter";
import HomePage from "./HomePage";
import MealLoggingPage from "./MealLoggingPage";
import DashboardLayout from "../components/DashboardLayout";
import LoginPage from "./LoginPage";
import Recipes from "./Recipes";

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={LoginPage} />
        <DashboardLayout>
          <Route path="/home" component={HomePage} />
          <Route path="/meal" component={MealLoggingPage} />
          <Route path="/recipes" component={Recipes} />
        </DashboardLayout>
      </Switch>
    </Router>
  );
}
