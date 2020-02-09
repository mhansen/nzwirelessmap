import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App ref={(component) => { window.app = component; } }/>, document.getElementById('root'));
