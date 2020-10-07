import React from "react";

import Nav from "./nav";
import Content from "./content";
import { DrupalProvider } from "../contexts/drupal";

export default () => (
  <DrupalProvider initialURL="/?_format=api_json">
    <Nav />
    <Content />
  </DrupalProvider>
);
