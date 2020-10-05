import React from 'react';
import { render } from 'react-dom';

import {default as Home} from './components/screen/home';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app-root');
  render(<Home />, root);
});
