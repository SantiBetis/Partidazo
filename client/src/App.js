import React, { useContext } from "react";
import GlobalStyles from "./GlobalStyles.js";
import LoginSignupPage from "./components/login-signup-pages/LoginSignupPage.js";
import LoginPage from "./components/login-signup-pages/LoginPage.js";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import SignupPage from "./components/login-signup-pages/SignupPage.js";
import styled from "styled-components";
import ChatLists from "./components/chat-page/AllJoinedChatsLists.js";
import { CurrentUserContext } from './components/all-contexts/currentUserContext.js';
import NavBar from "./components/nav-bar/NavBar.js";
import Profile from "./components/profile-page/Profile.js";
import Home from "./components/homefeed/Home.js";
import ActivityForm from "./components/create-activity-page/ActivityForm.js";
import ActivityDetails from "./components/acitivity-components/ActivityDetails.js";
import ChatSys from "./components/chat-page/ChatSys.js";
import Notifications from "./components/notifications-page/Notifications.js";
function App() {

  const { isUserLoggedIn, usuarioActual } = useContext(CurrentUserContext);

  return (
      <BrowserRouter>
      <GlobalStyles />
      <Wrapper>
        <Conatiner>
          <Switch>
            <Route exact path="/">
              { isUserLoggedIn ? <Redirect to ={ `/profile/${usuarioActual._id}` } /> : <LoginSignupPage/> }
            </Route>
            <Route path="/signup">
              <SignupPage/>
            </Route>
            <Route path="/login">
              <LoginPage/>
            </Route>
            { isUserLoggedIn &&
              <MainAppContainer>
                <SubContainer>
                  <Route exact path="/profile/:_id">
                    <Profile/>
                  </Route>
                  <Route path="/group-chats">
                    <ChatLists />
                  </Route>
                  <Route path ="/chats/:_id">
                    <ChatSys/>
                  </Route>
                  <Route path="/create-actividad">
                    <ActivityForm/>
                  </Route>
                  <Route path="/home">
                    <Home/>
                  </Route>
                  <Route path="/actividad/:_id">
                    <ActivityDetails/>
                  </Route>
                  <Route path="/notifications">
                    <Notifications/>
                  </Route>
                </SubContainer>
                <NavBar/>
              </MainAppContainer>
            }
            <Route path="">
                <Redirect to ='/'/>  
            </Route>

          </Switch>
        </Conatiner>
      </Wrapper>
    </BrowserRouter>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2C2C2C;
`;

const Conatiner = styled.div`
  width: 414px;
  height: 736px;

  @media (max-width: 414px) {
        width: 100%;
  }

  @media (max-height: 736px) {
        height: 100%;
  }
`;

const MainAppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const SubContainer = styled.div`
  height: calc(100% - 60px);
  background: #293241;
  background: -webkit-linear-gradient(to bottom, #141e30, #243b55); 
  background: linear-gradient(to bottom, #141e30, #243b55);
  color: white;
  overflow: hidden;
  `;
export default App;

