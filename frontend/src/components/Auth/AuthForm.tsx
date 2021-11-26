import React from "react";
import {AppContext, GlobalContext} from "../../App";
import {helper} from "../../services/helper";
import "./AuthForm.css";
import OpenWareLogoSmall from "../../img/logo-openware-small.svg";

/**
 * Components list
 */
export enum Components {
    SignUp = 1,
    Registered,
    SignIn
}

/**
 * Auth Forms Selector
 * @constructor
 */
export default function AuthForm() {
    const [component, setComponent] = React.useState<Components>(Components.SignIn);
    const appContext = React.useContext(AppContext);

    function getComponent() {
        switch (component) {
            case Components.SignUp:
                return <SignUp setComponent={setComponent} appContext={appContext} />
            case Components.Registered:
                return <SingIn setComponent={setComponent} appContext={appContext} success={true} />
            case Components.SignIn:
            default:
                return <SingIn setComponent={setComponent} appContext={appContext} />
        }
    }

    return (
        <div className={'bg'}>
            <div className={'dino'}>
                {getComponent()}
            </div>
        </div>
    )
}

/**
 * Component Props
 */
export type ComponentProps = {
    setComponent: React.Dispatch<React.SetStateAction<Components>>,
    appContext: GlobalContext | undefined | null,
    success?: boolean
}

/**
 * Sing In Component
 * @param {Function} setComponent
 * @param {Object} appContext
 * @constructor
 */
function SingIn({setComponent, appContext, success}: ComponentProps) {
    const [responseError, setResponseError] = React.useState(false);
    const emailRef = React.createRef<HTMLInputElement>();
    const passwordRef = React.createRef<HTMLInputElement>();

    async function dispatchSignIn() {
        const email = emailRef.current?.value || '';
        const password = passwordRef.current?.value || '';

        const response = await fetch('/user/signin', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({email, password})
        }).then(data => data.text());

        if (helper.isJson(response)) {
            const error = JSON.parse(response);
            setResponseError(error.error);
        } else {
            if (appContext !== null) {
                if (appContext !== undefined) {
                    localStorage.setItem('jwtToken', response as string);
                    localStorage.setItem('email', email as string);

                    appContext.setUserEmail(email as string);
                    appContext.setJwtToken(String(response) as string);
                }
            }
        }
    }

    return (
        <div className={'form-box sign-in'}>
            <div className={'flex-col flex'}>
                <div className={'flex flex-row'}>
                    <img src={OpenWareLogoSmall} alt={"Openware"} className={'pr-1.5'} />
                    <span className={'font-sans font-medium text-2xl text-gray-500'}>Todo</span>
                </div>
                <span className={'pt-1.5 pb-3 font-sans font-medium text-lg'}>Sign in</span>
                {responseError ?
                    <span className={'text-red-500 mb-5'}>{responseError}</span> : null
                }
                {success === true ?
                    <span className={'text-green-500 mb-5'}>Registration completed successfully!</span> : null
                }
                <input ref={emailRef} type={"email"} className={'mb-2 pb-0.5'} placeholder={'Email'}
                    onClick={() => {
                        setResponseError(false);
                    }} autoComplete="email" />
                <input ref={passwordRef} type={"password"} className={'mb-4 pb-0.5'} placeholder={'Password'}
                    autoComplete="new-password" />
                <span className={'text-sm font-sans mt-2'}>No account?
                    <button
                        onClick={() => setComponent(Components.SignUp)}
                        className={'ml-2 text-yellow-300 font-sans underline cursor-pointer'}>Create one!</button>
                </span>
                <span className={'text-sm font-sans mt-2'}>Forgot password?</span>
            </div>
            <div className={'flex flex-row-reverse'}>
                <button className={'btn font-sans'} onClick={dispatchSignIn} type={'button'}>Sign in</button>
            </div>
        </div>
    )
}

/**
 * Sign Up Component
 * @param {Function} setComponent
 * @constructor
 */
function SignUp({setComponent}: ComponentProps) {
    const emailRef = React.createRef<HTMLInputElement>();
    const passwordRef = React.createRef<HTMLInputElement>();
    const confirmPasswordRef = React.useRef(null);

    const [responseError, setResponseError] = React.useState(false);

    /**
     * Sign Up Dispatcher
     */
    async function dispatchSignUp() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await fetch('/user/signup', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({email, password})
        }).then(response => response.text());

        if (helper.isJson(response)) {
            const error = JSON.parse(response);
            setResponseError(error.error);
        } else {
            setComponent(Components.Registered);
        }
    }

    return (
        <div className={'form-box sign-up'}>
            <div className={'flex-col flex'}>
                <div className={'flex flex-row'}>
                    <img src={OpenWareLogoSmall} alt={"Openware"} className={'pr-1.5'} />
                    <span className={'font-sans font-medium text-2xl text-gray-500'}>Todo</span>
                </div>
                <span className={'pt-1.5 pb-3 font-sans font-medium text-lg'}>Sign up</span>
                {responseError ?
                    <span className={'text-red-500 mb-5 uppercase'}>{responseError}</span> : null
                }
                <input ref={emailRef} onClick={() => setResponseError(false)} type={'email'}
                    className={'mb-2 pb-0.5'} placeholder={'Email'} autoComplete={'email'} />
                <input ref={passwordRef} type={"password"} className={'mb-2 pb-0.5'} placeholder={'Password'}
                    autoComplete={'new-password'} />
                <input ref={confirmPasswordRef} type={'password'} className={'mb-4 pb-0.5'}
                    placeholder={'Confirm password'} autoComplete={'new-password'} />
            </div>

            <div className={'flex flex-row-reverse'}>
                <button className={'btn'} onClick={dispatchSignUp} type={'button'}>Sign up</button>
                <button className={'btn back-btn mr-4'}
                    onClick={() => setComponent(Components.SignIn)} type={'button'}>Back
                </button>
            </div>
        </div>
    )
}
