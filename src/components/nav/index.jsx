import React from "react";

import { frontendURL } from "../../utils/url";
import { Link } from "@reach/router";

function LinkElement({ menuLink }) {
  if (menuLink.href === null) {
    return <span>{menuLink.title}</span>;
  }
  // Use the router to follow the link if the link is a JSON:API link;
  // otherwise, use a standard anchor link to force a true window navigation.
  const target = frontendURL(menuLink.href);
  const { title, description } = menuLink;
  return menuLink.type === "application/vnd.api+json" ? (
    <Link
      to={`${target.pathname}${target.search}${target.hash}`}
      title={description}
    >
      {title}
    </Link>
  ) : (
    <a href={target.toString()} title={menuLink.description}>
      {title}
    </a>
  );
}

const LinkItem = ({ link }) => {
  return (
    <li className="menu_item">
      <LinkElement menuLink={link} />
      {!!link.children && <LinkItems links={link.children} childList />}{" "}
    </li>
  );
};

const LinkItems = ({ links, childList = false }) => {
  const items = links.map((link, key) => <LinkItem {...{ key, link }} />);
  return items.length ? (
    <ul className={!childList ? "menu" : ""}>{items}</ul>
  ) : null;
};

export default function Nav({ tree }) {
  return (
    <nav>
      <LinkItems links={tree} />
    </nav>
  );
}
