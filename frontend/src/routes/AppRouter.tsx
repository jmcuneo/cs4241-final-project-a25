import { Router, Switch, Route } from "wouter";
import HomePage from "./HomePage";
import MealLoggingPage from "./MealLoggingPage";
import DashboardLayout from "../components/DashboardLayout";
import LoginPage from "./LoginPage";

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={LoginPage} />
        <DashboardLayout>
          <Route path="/home" component={HomePage} />
          <Route path="/meal" component={MealLoggingPage} />
        </DashboardLayout>
      </Switch>
    </Router>
  );
}
