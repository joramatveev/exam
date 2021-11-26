import React from 'react'
import {Redirect, Route, Switch} from "react-router";
import userInfo from "./services/userInfo";
import ProtectedRoute from "./services/ProtectedRoute";
import AuthForm from "./components/Auth/AuthForm";
import Sidebar from "./components/Bars/Sidebar";
import Navbar from "./components/Bars/Navbar";
import List from "./components/Todo/List";
import "./App.css";

/**
 * Application Context
 */
export const AppContext = React.createContext<GlobalContext | null>(null);

/**
 * List Of Tasks Structure
 */
export type ListEntry = {
    id: number,
    name: string,
}

/**
 * Task Object Structure
 */
export type TaskEntry = {
    id: string | number | null,
    name: string,
    description: string,
    status?: string
}

/**
 * Tasks Object Types
 */
export type TasksObjType = { [key: string]: TaskEntry; };

/**
 * Lists Objects Types
 */
export type ListsObjType = { [key: string]: ListEntry; };

/**
 * Global Context
 */
export type GlobalContext = {
    isAuth: boolean | null,
    setIsAuth: React.Dispatch<React.SetStateAction<boolean | null>>,
    jwtToken: string | null,
    setJwtToken: React.Dispatch<React.SetStateAction<string | null>>,
    userEmail: string | null,
    setUserEmail: React.Dispatch<React.SetStateAction<string | null>>,
    listsObj: ListsObjType,
    setListsObj: React.Dispatch<React.SetStateAction<ListsObjType>>,
    tasksObj: TasksObjType,
    setTasksObj: React.Dispatch<React.SetStateAction<TasksObjType>>,
    currentListId: string | number | null,
    setCurrentListId: React.Dispatch<React.SetStateAction<string | number | null>>,
    currentTaskId: string | number | null,
    setCurrentTaskId: React.Dispatch<React.SetStateAction<string | number | null>>
};

/**
 * App constructor
 * @constructor
 */
export default function App() {

    const [isAuth, setIsAuth] = React.useState<boolean | null>(false);

    const [jwtToken, setJwtToken] = React.useState<string | null>(null);
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    const [currentListId, setCurrentListId] = React.useState<string | number | null>(null);
    const [currentTaskId, setCurrentTaskId] = React.useState<string | number | null>(null);

    const [listsObj, setListsObj] = React.useState<ListsObjType>({});
    const [tasksObj, setTasksObj] = React.useState<TasksObjType>({});

    if (!jwtToken) {
        const storageJwtToken = String(localStorage.getItem('jwtToken'))
        if (storageJwtToken) {
            setJwtToken(storageJwtToken)
        }
    }
    if (!userEmail) {
        const storageEmail = String(localStorage.getItem('email'))
        if (storageEmail) {
            setUserEmail(storageEmail)
        }
    }

    /**
     * Initial State
     */
    const initialState: GlobalContext = {
        isAuth, setIsAuth,
        jwtToken, setJwtToken,
        userEmail, setUserEmail,
        listsObj, setListsObj,
        tasksObj, setTasksObj,
        currentListId, setCurrentListId,
        currentTaskId, setCurrentTaskId,
    };

    /**
     * Auth Checker
     */
    const authCheck = async () => {
        const userEmail = await userInfo()
        setIsAuth(userEmail)
        return userEmail;
    }

    React.useEffect(() => {
        (() => authCheck())();
    }, [jwtToken]);

    React.useEffect(() => {
    }, [currentListId]);

    React.useEffect(() => {
    }, [currentTaskId]);

    return (
        <AppContext.Provider value={initialState}>
            <Switch>
                <Route path={'/login'}>
                    {isAuth === true ? <Redirect to="/" /> : null}
                    <AuthForm />
                </Route>
                <ProtectedRoute redirectTo={'/login'} exact path={'/'}>
                    <div className={'flex flex-row'}>
                        <Sidebar />
                        <div className={'flex-col flex w-full'}>
                            <Navbar />
                            <List />
                        </div>
                    </div>
                </ProtectedRoute>
            </Switch>
        </AppContext.Provider>
    );
}
