import React from "react";

import Time from "../elements/time";

const Article = ({ data: { type, id, attributes = {} } }) => {
  const {
    title,
    created,
    changed,
    body = null,
    field_image = null,
  } = attributes;
  return (
    <article className="main_content main_content--article">
      <title>{title}</title>
      <h1>{title}</h1>
      <div className="main_content__dates">
        <p className="main_content__dates__date">
          <span>
            Published: <Time date={new Date(created)} />
          </span>
        </p>
        {created !== changed && (
          <p className="main_content__dates__date">
            <span>
              Updated: <Time date={new Date(changed)} />
            </span>
          </p>
        )}
      </div>
      {body && (
        <div
          className="main_content__body"
          dangerouslySetInnerHTML={{ __html: body.processed }}
        />
      )}
    </article>
  );
};

export default Article;
