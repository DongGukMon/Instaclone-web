import { isLoggedInVar, darkModeVar } from "./apollo";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import SignUp from "./screens/SignUp";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme, GlobalStyles } from "./styles";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import { client } from "./apollo";
import Layout from "./components/Layout";
import Banana from "./Banana";
import Profile from "./screens/Profile";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <Router>
            <Routes>
              <Route
                path={routes.home}
                element={
                  isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )
                }
              />
              {!isLoggedIn ? (
                <Route path={routes.signUp} element={<SignUp />} />
              ) : null}
              <Route path="/banana" element={<Banana />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/users/:username"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
            </Routes>
          </Router>
          <GlobalStyles />
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
