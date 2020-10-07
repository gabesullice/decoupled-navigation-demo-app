import React, { useContext } from "react";

import useMenu from "../../hooks/use-menu";

const LinkItem = ({ link }) => {
  return (
    <li>
      <a href="#" onClick={link.follow} title={link.description}>
        {link.title}
      </a>
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
