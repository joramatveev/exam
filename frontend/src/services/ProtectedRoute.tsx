import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {AppContext, GlobalContext} from "../App";

/**
 * Protected Route Props
 */
type ProtectedRouteProps = {
    redirectTo: string;
} & RouteProps;

/**
 * Protected Routes Helper
 * @param {String} redirectTo
 * @param {Object} routeProps
 * @constructor
 */
export default function ProtectedRoute({redirectTo, ...routeProps}: ProtectedRouteProps) {
    const appContext = React.useContext(AppContext) as GlobalContext;
    if (appContext.isAuth === true) {
        return <Route {...routeProps} />;
    } else {
        return <Redirect to={{pathname: redirectTo}} />;
    }
}
