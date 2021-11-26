import React from "react";
import {AppContext, GlobalContext, TaskEntry} from "../../App";
import "./Sidebar.css";
import getLists from "../../services/lists/getLists";
import createList from "../../services/lists/createList";
import deleteList from "../../services/lists/deleteList";
import Settings from "../Modals/Settings";

import OpenwareLogoSmallWhite from "../../img/logo-openware-small-white.svg";
import CollapseArrow from "../../img/collapse-arrow.png";
import PlusBlackImg from "../../img/plus.svg";
import AdjustmentsImg from "../../img/settings.svg";
import GlobeImg from "../../img/globe.svg";
import CogImg from "../../img/cog.svg";
import ListDotsImg from "../../img/list.svg";
import DeleteList from "../../img/black-trash.svg";

export default function Sidebar() {
    const appContext = React.useContext(AppContext);
    if (appContext === null) {
        throw new Error('Application context is null');
    }

    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [lists, setLists] = React.useState<JSX.Element[]>([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [newListName, setNewListName] = React.useState('New List');

    const [listsNamesInputHasFocus, setListsNamesInputFocus] = React.useState(false);

    React.useEffect(() => {
        if (appContext !== null) {
            getLists(appContext);
        }
    }, []); // eslint-disable-line

    React.useEffect(() => {
        if (appContext !== null) {
            if (Object.keys(appContext.listsObj).length < 1) {
                setLists([]);
                return;
            }
            const newListButton = (key: number, name: string, listId: string | number) => {
                const ctx = appContext as GlobalContext;
                return (
                    <div key={String(key)}
                        className={'mb-3 flex flex-row justify-between items-center todo-list-item'}>
                        <div className={'flex flex-row justify-start items-center cursor-pointer'}
                            onClick={() => ctx.setCurrentListId(listId)}
                        >
                            <img src={ListDotsImg} alt="" style={{width: '15.5px', height: '15.5px'}} className={'mr-3'} />
                            {isCollapsed ? null : <span>{name}</span>}
                        </div>
                        <div className={'flex flex-row justify-end items-center cursor-pointer'}>
                            {isCollapsed ? null : <img src={DeleteList} alt={'delete list'} onClick={() => deleteList({
                                appContext: ctx,
                                listId: listId as number
                            })} className={'delete-list'} />}
                        </div>
                    </div>
                )
            }
            if (Object.keys((appContext as GlobalContext).listsObj).length > 0) {
                const arr: JSX.Element[] = [];
                let key = 0;
                for (let [, value] of Object.entries((appContext as GlobalContext).listsObj)) {
                    arr.push(newListButton(key++, (value as TaskEntry).name as string, (value as TaskEntry).id as string | number));
                }
                setLists(arr);
            }
        }
    }, [appContext.listsObj, isCollapsed]); // eslint-disable-line

    /**
     * Handle List Creation
     */
    function handleListCreation() {
        if (appContext !== null) {
            createList({
                appContext,
                listName: newListName
            }).then(() => handleNewListNameChange({target: {value: 'New List'}}))
        }
    }

    /**
     * Handle New List Name Change
     * @param event
     */
    const handleNewListNameChange = (event: { target: { value: any }; }) => setNewListName(event.target.value);

    return (
        <>
            <div style={{backgroundColor: '#FCD620'}}
                className={`h-screen ${isCollapsed ? 'w-12' : 'w-64'} flex-col flex justify-between`}>
                <div className={`mt-4 ${isCollapsed ? 'ml-3' : 'ml-3'} flex-col flex justify-start`}>
                    <img src={OpenwareLogoSmallWhite} alt={"Openware"}
                        style={{width: '24px', height: '17px', position: 'relative', right: '4px'}}
                        className={'mt-4 mb-8 ml-1'} />
                    <div className={'flex flex-row mb-5 ml-1 cursor-pointer '}
                        onClick={() => setIsCollapsed(!isCollapsed)}>
                        <img src={CollapseArrow} alt="collapse" className={isCollapsed ? 'transform rotate-180' : ''} />
                    </div>
                    {lists}
                    <div onClick={() => setIsCollapsed(false)}
                        className={`flex flex-row justify-between items-center todo-list-item todo-list-item-input ${listsNamesInputHasFocus === true ? ' todo-list-item-focused ' : ''}`}>
                        <div className={'flex flex-row justify-start items-center'}>
                            <img src={PlusBlackImg} alt="" style={{width: '15.33px', height: '15.33px'}}
                                className={'mr-3'} />
                            {isCollapsed ? null :
                                <input type={'text'} className={'w-24'}
                                    onFocus={() => {
                                        setNewListName('');
                                        setListsNamesInputFocus(true)
                                    }}
                                    onBlur={() => {
                                        if (newListName === '') {
                                            setNewListName('New List');
                                            setListsNamesInputFocus(false);
                                            return;
                                        }
                                        setTimeout(() => {
                                            setListsNamesInputFocus(false)
                                        }, 200)
                                    }}
                                    placeholder={newListName}
                                    value={newListName} onChange={handleNewListNameChange} />}
                        </div>
                        <div className={'flex flex-row justify-end items-center'}>
                            {isCollapsed || !listsNamesInputHasFocus ? null :
                                <button onClick={handleListCreation}
                                    className={'cursor-pointer todo-item-add-btn'}>Add</button>}
                        </div>
                    </div>
                </div>

                <div className={`mb-5 flex ${isCollapsed ? 'flex-col' : 'flex-row'} justify-evenly items-center`}>
                    <button className={`${isCollapsed ? 'mb-3' : ''}`}><img src={AdjustmentsImg} alt={"Adjustments"} /></button>
                    <button className={`${isCollapsed ? 'mb-3' : ''}`}><img src={GlobeImg} alt={"Globe"} /></button>
                    <button className={`${isCollapsed ? '' : ''}`} onClick={() => setModalIsOpen(!modalIsOpen)}><img
                        src={CogImg} alt={"Cog"} /></button>
                </div>
            </div>

            {modalIsOpen ? <Settings /> : null}
        </>
    )
}
