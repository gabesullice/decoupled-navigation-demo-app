import React, { useContext } from "react";

import useMenu from "../../hooks/use-menu";
import { newURLWithOrigin } from "../../utils/url";

const LinkItem = ({ link }) => {
  const target = newURLWithOrigin(link.href, window.location);
  target.searchParams.delete("_format");

  const anchorAttributes = {
    href: target.toString(),
    title: link.description,
  };

  if (link.follow) {
    anchorAttributes.onClick = (e) => {
      e.preventDefault();
      link.follow();
    };
  }

  return (
    <li>
      <a {...anchorAttributes}>{link.title}</a>
      <LinkItems links={link.children || []} />
    </li>
  );
};

const LinkItems = ({ links }) => {
  const items = links.map((link, key) => <LinkItem {...{ key, link }} />);
  return items.length ? <ul>{items}</ul> : null;
};

export default () => {
  const { tree } = useMenu("main");

  if (!tree) {
    return null;
  }

  return (
    <nav>
      <LinkItems links={tree} />
    </nav>
  );
};
