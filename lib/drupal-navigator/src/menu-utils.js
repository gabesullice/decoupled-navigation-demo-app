import { relMenuItem } from "./link-rels";

/**
 * Turns a links object into an array of links with a `rel` member.
 */
function normalizeLinks(linksObject) {
  return Object.entries(linksObject).map(([key, { href, rel, meta }]) => {
    return {
      href: href.length ? new URL(href) : null,
      rel: rel || key.split("--")[0],
      meta: { type: "application/vnd.api+json", ...meta },
    };
  });
}

function parseMenu(menu, doc) {
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
        type: meta.type || "application/vnd.api+json",
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

// @todo: refactor this so that it's not repeatedly parsing the same menus.
export function parseMenus(doc) {
  const menuIDs = normalizeLinks(doc.links || {})
    .filter((link) => link.rel === relMenuItem)
    .reduce((ids, link) => ids.add(link.meta.menu), new Set());

  return [...menuIDs].reduce((menus, id) => {
    return { ...menus, [id]: parseMenu(id, doc) };
  }, {});
}
