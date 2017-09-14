import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

window.onload = () => {
  ReactDOM.render(
    <Main />,
    document.querySelector('#container')
  );
};
