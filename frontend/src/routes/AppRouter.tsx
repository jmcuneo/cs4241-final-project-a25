import { Router, Switch, Route } from "wouter";
// import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./HomePage";
import MealLoggingPage from "./MealLoggingPage";
import DashboardLayout from "../components/DashboardLayout";
import LoginPage from "./LoginPage";

export default function AppRouter() {
  // const { isAuthenticated } = useAuth0();

  // if (!isAuthenticated) {
  //   return <Redirect to="/" />;
  // }

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
