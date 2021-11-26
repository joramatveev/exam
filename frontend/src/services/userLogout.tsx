import {GlobalContext} from "../App";

/**
 * User Logout
 * @param {Object} appContext
 */
export default function userLogout(appContext: GlobalContext) {
    appContext.setJwtToken("");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
}
