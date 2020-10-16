import { useContext } from "react";

import { DrupalContext } from "../contexts/drupal";
import { relMenuItem } from "../drupal/link-rels";

/**
 * Turns a links object into an array of links with a `rel` member.
 */
function normalizeLinks(linksObject) {
  return Object.entries(linksObject).map(([key, { href, rel, meta }]) => {
    return {
      href: new URL(href),
      rel: rel || key.split("--")[0],
      meta: { type: "application/vnd.api+json", ...meta },
    };
  });
}

function parseMenu(menu, doc, followFn) {
  const menuLinks = normalizeLinks(doc.links || {})
    .filter((link) => {
      return link.rel === relMenuItem && link.meta.menu === menu;
    })
    .map((link) => {
      const { href, meta } = link;
      return {
        href,
        title: meta.title,
        description: meta.description,
        hierarchy: meta.hierarchy,
        follow: !meta.type.startsWith("text/html")
          ? () => followFn(link)
          : null,
      };
    });

  if (!menuLinks.length) {
    return null;
  }

  menuLinks.sort((a, b) => a.hierarchy < b.hierarchy);

  const lastLength = (level) => level[level.length - 1].hierarchy.length;
  const stack = [];
  let level = [];
  do {
    if (!level.length) {
      level.push(menuLinks.shift());
    } else {
      const currLength = menuLinks[0].hierarchy.length;
      if (lastLength(level) === currLength) {
        level.push(menuLinks.shift());
      } else if (lastLength(level) < currLength) {
        stack.push([...level]);
        level = [];
      } else {
        do {
          const children = [...level];
          level = stack.pop();
          const parent = level[level.length - 1];
          children.forEach((child) => {
            if (child.hierarchy.startsWith(parent.hierarchy)) {
              parent.children
                ? parent.children.push(child)
                : (parent.children = [child]);
            }
          });
        } while (lastLength(level) > currLength);
        level.push(menuLinks.shift());
      }
    }
  } while (menuLinks.length);

  if (stack.length) {
    do {
      const children = [...level];
      level = stack.pop();
      level[level.length - 1].children = children;
    } while (stack.length);
  }

  // Removes the `hierarchy` key and `description` if it's undefined.
  const clean = (links, link) => {
    delete link.hierarchy;
    if (link.description === undefined) {
      delete link.description;
    }
    if (link.children) {
      link.children = link.children.reduce(clean, []);
    }
    return [...links, link];
  };

  return level.reduce(clean, []);
}

export default (menu) => {
  const { response, json, loading, follow } = useContext(DrupalContext);
  return {
    tree: json && response.ok ? parseMenu(menu, json, follow) : null,
    loading,
  };
};
