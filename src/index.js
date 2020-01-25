import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";


import {storeHandler} from "./redux/reducers/main";
import LoginForm from "./pages/Login";

import "antd/dist/antd.css"
import "./css/main.css"
import RegisterForm from "./pages/Register";
import TestPage from "./pages/TestPage";
// import LoginForm from "./pages/Login";


const loadState = () => {
    try {
        const userData = localStorage.getItem('_priceT');
        if (!userData) return {user_id: -1};

        return JSON.parse(userData);
    } catch (e) {
        return {user_id: -1};
    }
};

const initialAppState = {
    AppVersion: "0.1.0",
    user: loadState(),
    s:'sd'
};

const store = createStore(storeHandler, initialAppState);
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path={"/t"}>
                    <TestPage/>
                </Route>
                <Route path={"/test"}>test</Route>
                <Route path={"/register"}>
                    <RegisterForm/>
                </Route>
                <Route path={"/login"}>
                    <LoginForm/>
                </Route>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);