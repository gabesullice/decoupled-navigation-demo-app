import React from "react";

export default ({ data: { attributes = {} } }) => {
  const { title, body = null } = attributes;
  return (
    <article className="main_content main_content--page">
      <title>{title}</title>
      <h1>{title}</h1>
      {body && (
        <div
          className="main_content__body"
          dangerouslySetInnerHTML={{ __html: body.processed }}
        />
      )}
    </article>
  );
};
