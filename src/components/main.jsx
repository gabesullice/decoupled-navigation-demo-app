import React from "react";

import Nav from "./nav";
import Content from "./content";
import { DrupalProvider } from "../contexts/drupal";
import ReactIcon from "./elements/react-icon";

export default ({ config }) => (
  <DrupalProvider config={config.drupal}>
    <div className="page_wrapper">
      <ReactIcon />
      <Nav />
      <Content />
    </div>
  </DrupalProvider>
);
