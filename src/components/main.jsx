import React from "react";

import Nav from "./nav";
import Content from "./content";
import { DrupalProvider } from "../contexts/drupal";

export default ({ config }) => (
  <DrupalProvider config={config.drupal}>
    <Nav />
    <Content />
  </DrupalProvider>
);
