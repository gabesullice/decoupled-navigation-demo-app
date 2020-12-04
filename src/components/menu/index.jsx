import React, { useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

import { Link as RouterLink } from "@reach/router";
import { frontendURL } from "../../utils/url";
import ReactIcon from "../elements/react-icon";

function isRoutable(item) {
  const isJSONAPI = item.type === "application/vnd.api+json";
  const isExternal = item.href.host !== window.location.host;
  return isJSONAPI && !isExternal;
}

function Item({ item, inDropdown = false }) {
  // If the link is routable, we want the router to handle it. If it is
  // not, we want the browser to perform a navigation.
  const ItemLink = inDropdown ? NavDropdown.Item : Nav.Link;
  const target = frontendURL(item.href);
  const routingProps = isRoutable(item)
    ? {
        as: RouterLink,
        to: `${target.pathname}${target.search}${target.hash}`,
      }
    : { href: item.href.toString() };
  return (
    <ItemLink title={item.description} {...routingProps}>
      {item.title}
    </ItemLink>
  );
}

function Dropdown({ title, items }) {
  // Use isOpen to show menu on hover.
  const [isOpen, setOpen] = useState(false);
  // React Bootstrap does not support parent items that are links, only text.
  // Therefore, the parent item it only used for its title.
  return (
    <NavDropdown title={title}
                 onMouseEnter = {() => setOpen(true)}
                 onMouseLeave = {() => setOpen(false)}
                 show={ isOpen }
    >
      {items.map((item, key) => {
        // If the item is not a link, render it as text.
        if (item.href === null) {
          return (
            <NavDropdown.ItemText key={key}>{item.title}</NavDropdown.ItemText>
          );
        }
        return <Item key={key} item={item} inDropdown />;
      })}
    </NavDropdown>
  );
}

function LinkItems({ items }) {
  return items.map((item, key) => {
    // React Bootstrap does not support parent items that are links, only text.
    // Therefore, we only render children in a dropdown if the item is
    // text-only. If it isn't, this condition won't pass and the item will be
    // rendered a link and its children will be ignored.
    if (item.href === null) {
      if (!!item.children) {
        return <Dropdown key={key} title={item.title} items={item.children} />;
      }
      return <Navbar.Text>{item.title}</Navbar.Text>;
    }

    return <Item key={key} item={item} />;
  });
}

export default function Menu({ tree }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <ReactIcon />
        <Navbar.Text>DrupalCon Europe</Navbar.Text>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          <LinkItems items={tree} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
