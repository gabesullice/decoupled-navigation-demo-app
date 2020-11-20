import { useLocation } from "@reach/router";
import { ResponseProvider, useMenu } from "@drupal/navigator";
import React from "react";
import Menu from "../menu";
import { backendURL } from "../../utils/url";
import { MainContent } from "../layout";
import Content from "../content";

function url(path) {
  return new URL(path, window.location.href);
}

const tree = [
  {
    title: "Tracks",
    href: null,
    children: [
      {
        title: "Agency & Business",
        href: url("/tracks/agency-business"),
      },
      {
        title: "Clients & Industry Experiences",
        href: url("/tracks/clients-industry"),
      },
      {
        title: "Makers & Builders",
        href: url("/tracks/agency-business"),
      },
      {
        title: "Open Web & Community",
        href: url("/tracks/open-web-community"),
      },
      {
        title: "Users & Editors",
        href: url("/tracks/users-editors"),
      },
    ],
  },
  {
    title: "My schedule",
    href: url("/schedule"),
  },
  {
    title: "My Account",
    href: url("/user"),
  },
];

function NavBar() {
  // const { tree } = useMenu("main");
  return <Menu tree={tree} />;
}

export default function DrupalPage() {
  const location = useLocation();
  return (
    <ResponseProvider url={backendURL(location)}>
      <NavBar />
      <MainContent>
        <Content />
      </MainContent>
    </ResponseProvider>
  );
}
