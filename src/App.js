import React from 'react';
import './App.scss';
import {
  BrowserRouter,
  Switch,
  Router,
  Redirect,
  useLocation
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to my <b>React Chat</b> application.
        </p>
      </header>
    </div>
  );
}

export default App;
