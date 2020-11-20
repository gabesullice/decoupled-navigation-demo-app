import React from "react";

export function PageWrapper({ children }) {
  return <div className="page_wrapper">{children}</div>;
}

export function MainContent({ children }) {
  return <div className="main_content_container">{children}</div>;
}
