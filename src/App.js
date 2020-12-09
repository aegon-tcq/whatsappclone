import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Login'
import { useStateValue } from "./StateProvider";
import HomeScreen from './HomeScreen'

function App() {

  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) :
        (
          <div className='app__body' >
            <Router>
              <Sidebar />
              <Switch>
                <Route path="/groups/:groupId/:chatId">
                  <Chat />
                </Route>
                <Route path="/">
                 <HomeScreen />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
    </div>
  );
}

export default App;
