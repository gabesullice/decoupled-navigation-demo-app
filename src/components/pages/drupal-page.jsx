import { useLocation } from "@reach/router";
import { ResponseProvider, useMenu } from "@drupal/navigator";
import React from "react";
import Nav from "../nav";
import { backendURL } from "../../utils/url";
import { MainContent } from "../layout";
import Content from "../content";

function Menu() {
  const { tree } = useMenu("main");
  return tree && <Nav tree={tree} />;
}

export default function DrupalPage() {
  const location = useLocation();
  return (
    <ResponseProvider url={backendURL(location)}>
      <Menu />
      <MainContent>
        <Content />
      </MainContent>
    </ResponseProvider>
  );
}
