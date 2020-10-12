import React from "react";

const Time = ({ date }) => (
  <time dateTime={date.toString()}>{date.toLocaleString()}</time>
);

export default Time;
