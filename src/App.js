import React from "react";
import "./App.scss";
import {
  Redirect,
  BrowserRouter,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import AddRoom from "./components/AddRoom/AddRoom";
import Login from "./components/Login/Login";
import RoomList from "./components/RoomList/RoomList";
import ChatRoom from "./components/ChatRoom/ChatRoom";

function App() {
  let location = useLocation();

  const SecureRoute = ({ children, ...rest }) => (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("nickname") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );

  return (
    <BrowserRouter>
      <div>
        <Redirect
          to={{
            pathname: "roomlist",
            state: { from: location },
          }}
        />

        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <SecureRoute path="/roomlist">
            <RoomList />
          </SecureRoute>

          <SecureRoute path="/addroom">
            <AddRoom />
          </SecureRoute>

          <SecureRoute path="/chatroom/:room">
            <ChatRoom />
          </SecureRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
