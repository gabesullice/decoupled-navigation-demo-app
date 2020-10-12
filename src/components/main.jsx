import React from "react";

import Nav from "./nav";
import Content from "./content";
import { DrupalProvider } from "../contexts/drupal";

export default ({ config }) => (
  <DrupalProvider config={config.drupal}>
    <div className="page_wrapper">
      <Nav />
      <Content />
    </div>
  </DrupalProvider>
);
