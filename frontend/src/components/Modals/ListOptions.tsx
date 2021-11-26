import React from "react";
import {AppContext} from "../../App";
import renameList from "../../services/lists/renameList";
import RedTrashIcon from "../../img/red-trash.svg";
import RenameIcon from "../../img/rename.svg";
import deleteList from "../../services/lists/deleteList";
import "./ListOptions.css";

/**
 * List Options Modal Properties
 */
type ListOptionsModalProps = {
    setListOptionsModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

/**
 * List Options Modal
 * @param {Function} setListOptionsModalIsOpen
 * @param {Function} setRenameModalIsOpen
 * @constructor
 */
export default function ListOptions({setListOptionsModalIsOpen}: ListOptionsModalProps) {
    const appContext = React.useContext(AppContext);

    const currentList: any = appContext !== null ? Object.values(appContext.listsObj).find(t => t.id === appContext.currentListId) : {};

    const [isEditListName, setIsEditListName] = React.useState<boolean>(false);
    const [newListName, setNewListName] = React.useState<string>(currentList.name);

    /**
     * Handle New Name Input
     * @param event
     */
    const handleNewNameInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewListName(event.target.value);
    }

    /**
     * Handle Delete
     */
    function handleDelete() {
        if (appContext !== null) {
            deleteList({appContext, listId: appContext.currentListId}).then(() => setListOptionsModalIsOpen(false));
        }
    }

    return (
        <div className={'todolist-modal todo-list-options-modal ml-11 bg-white flex-col flex items-center'}>
            <div
                className={'options-modal-title text-center w-full font-medium text-black border-solid border-b-2 border-gray-200'}>
                List options
            </div>
            {isEditListName
                ? (<input type={'text'} autoFocus onBlur={() => {
                    if (newListName !== '') {
                        if (appContext !== null) {
                            renameList({appContext, newName: newListName}).then(() => setListOptionsModalIsOpen(false));
                        }
                    }
                    setIsEditListName(false)
                }} onChange={handleNewNameInput} value={newListName} />)
                : (<button onClick={() => setIsEditListName(true)}
                    style={{width: '170px', height: '50px', borderRadius: '4px'}}
                    className={'mx-2 mb-1 mt-2 pl-2 flex flex-row items-center hover:bg-gray-100'}>
                    <img src={RenameIcon} alt="rename list" className={'mr-4'}
                        style={{width: '20px', height: '20px'}} />
                    <span>Rename list</span>
                </button>)
            }
            <button onClick={handleDelete}
                style={{width: '170px', height: '50px', borderRadius: '4px'}}
                className={'mx-2 mb-2 mt-1 pl-2 flex flex-row items-center hover:bg-gray-100'}>
                <img src={RedTrashIcon} alt="Delete list" className={'mr-4'} style={{width: '18px', height: '18px'}} />
                <span style={{color: '#D70000'}}>Delete list</span>
            </button>
        </div>
    )
}
