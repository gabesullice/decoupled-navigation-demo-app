import React, { useContext } from 'react';

import { DrupalContext } from '../../contexts/page';

export default () => {
  const { loading, json } = useContext(DrupalContext);

  if (loading || !json) {
    return null;
  }

  return (<nav>
    <ul>
      <li>{json.data.type}</li>
      <li>This is a nav item.</li>
      <li>This is another nav item.</li>
    </ul>
  </nav>);
};
