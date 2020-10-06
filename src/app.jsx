import React from 'react';
import { render } from 'react-dom';

import Main from './components/main';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app-root');
  render(<Main />, root);
});
