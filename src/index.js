import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/global.scss';

// This is the root of the React library, here we render the React calculated
// DOM structure to the React hook: <div id="opsview-web"></div>
ReactDOM.render(<App />, document.getElementById('opsview-web'));
