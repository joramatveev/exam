import React from "react";
import ProfileImage from "../../img/profile.svg";
import Profile from "../Modals/Profile";
import "./Navbar.css";

export default function Navbar() {
    const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);

    return (
        <div className={'flex-col flex justify-end items-end'}>
            <div
                className={'h-12 w-full bg-white flex flex-row justify-between items-center px-5 border-solid border-b-2 border-gray-200'}>
                <div>
                    <input id={'navbar-search'} type={"text"} placeholder={"Search"} />
                </div>
                <div onClick={() => setModalIsOpen(!modalIsOpen)} className={'ml-4'}>
                    <img src={ProfileImage} alt="profile" />
                </div>
            </div>

            {
                modalIsOpen ?
                    <div style={{position: 'absolute', top: '40px'}} className={'m-4 cursor-pointer'}>
                        <Profile />
                    </div>
                    : null
            }
        </div>
    )
}
