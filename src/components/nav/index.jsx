import React, { useContext } from "react";

import useMenu from "../../hooks/use-menu";

const LinkItem = ({ link }) => {
  const target = new URL(link.href.toString(), window.location);
  target.searchParams.delete("_format");
  const anchor = {
    href: `${target.pathname}${target.search}${target.hash}`,
    title: link.description,
    onClick: (e) => {
      e.preventDefault();
      link.follow();
    },
  };
  return (
    <li>
      <a {...anchor}>{link.title}</a>
      <LinkItems links={link.children || []} />
    </li>
  );
};

const LinkItems = ({ links }) => {
  const items = links.map((link, key) => <LinkItem {...{ key, link }} />);
  return items.length ? <ul>{items}</ul> : null;
};

export default () => {
  const { tree, loading } = useMenu("main");

  if (loading || !tree) {
    return null;
  }

  return (
    <nav>
      <LinkItems links={tree} />
    </nav>
  );
};
