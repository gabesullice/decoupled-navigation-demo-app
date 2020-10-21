import React from "react";

import Page from "./page";
import {
  ResponseSwitch as ViewSelector,
  ResponseCase as ViewIf,
} from "response-switch";
import { useJSON, useResponse } from "@drupal/navigator";
import Article from "./article";

const ArticleView = function () {
  const json = useJSON();
  return json && <Article data={json.data} />;
};

const PageView = function () {
  const json = useJSON();
  return json && <Page data={json.data} />;
};

export default function Content() {
  const responseContext = useResponse();
  return (
    <ViewSelector responseContext={responseContext}>
      <ViewIf json={{ pointer: "/data/type", value: "node--article" }}>
        <ArticleView />
      </ViewIf>
      <ViewIf json={{ pointer: "/data/type", value: "node--page" }}>
        <PageView />
      </ViewIf>
    </ViewSelector>
  );
}
