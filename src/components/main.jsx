import React from "react";

import { Router } from "@reach/router";
import { PageWrapper } from "./layout";
import Dashboard from "./pages/dashboard";
import DrupalPage from "./pages/drupal-page";

export default function Main() {
  return (
    <PageWrapper>
      <Router>
        <Dashboard path="dashboard" />
        <DrupalPage default />
      </Router>
    </PageWrapper>
  );
}
