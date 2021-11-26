import React from "react";
import {AppContext, TaskEntry} from "../../App";
import deleteTask from "../../services/tasks/deleteTask";
import {changeTaskStatus} from "../Todo/List";
import updateTask from "../../services/tasks/updateTask";
import CollapseArrow from "../../img/collapse-arrow.png";
import BlackTrash from "../../img/black-trash.svg";

type TaskEditModalProps = {
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Task Edit Modal
 * @param {Function} setModalIsOpen
 * @constructor
 */
export default function TaskEdit({setModalIsOpen}: TaskEditModalProps) {
    const appContext = React.useContext(AppContext);
    if (appContext === null || appContext.currentTaskId === null) {
        throw new Error('appContext is null');
    }

    const currentTask = Object.values(appContext.tasksObj).find(t => t.id === appContext.currentTaskId) || {}

    // @ts-ignore
    const [task, setTask] = React.useState<TaskEntry>(currentTask);

    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");

    React.useEffect(() => {
        setName(task.name);
        setDescription(task.description);
    }, [task]);

    React.useEffect(() => {
        if (appContext !== null && appContext.currentTaskId !== null) {
            const task = Object.values(appContext.tasksObj).find(t => t.id === appContext.currentTaskId);
            if (task) {
                setTask(task);
            }
        }
    }, [appContext.currentTaskId, appContext.tasksObj]); // eslint-disable-line

    /**
     * Dispatcher Task Deletion
     */
    function dispatchTaskDelete() {
        if (appContext !== null) {
            deleteTask(appContext, (task as TaskEntry).id as string | number).then(() => setModalIsOpen(false));
        }
    }

    /**
     * Update Task Property Parameters
     */
    type updateTaskPropsParams = {
        name?: string,
        description?: string,
        status?: string | null
    }

    /**
     * Update Task Properties
     * @param {Object} alteredTaskFields
     */
    async function updateTaskProps(alteredTaskFields: updateTaskPropsParams) {
        if (appContext !== null && appContext.currentTaskId !== null) {
            const oldTask = Object.values(appContext.tasksObj).find(t => t.id === appContext.currentTaskId);
            const alteredTask = {...oldTask, ...alteredTaskFields};
            // @ts-ignore
            await updateTask(appContext, appContext.currentTaskId, alteredTask);
        }
    }

    return (
        <div style={{backgroundColor: '#FCD620', width: '425px'}} className={'flex-col flex justify-between'}>
            <div className={'m-2.5'}>
                <div className={'mb-3'}>
                    <div style={{border: '1px solid #E8E8E8'}}
                        className={'h-14 w-full bg-white flex flex-row justify-start items-center'}>
                        <input type={"checkbox"} autoFocus className={'mr-5 ml-5'}
                            checked={((task as TaskEntry).status === 'completed')}
                            onChange={(_event) => {
                                changeTaskStatus(appContext, (task as TaskEntry).id as string | number)
                            }}
                        />
                        <input
                            type={'text'} value={name as string}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={(e) => updateTaskProps({name: e.target.value, status: null})}
                            className={'text-xl font-normal'}
                        />
                    </div>
                </div>
                <textarea
                    className={'p-4 h-72 w-full'}
                    onBlur={(e) => {
                        updateTaskProps({description: e.target.value, status: null})
                    }}
                    placeholder={'Description'}
                    defaultValue={description as string}
                />
            </div>
            <div className={'py-5 flex flex-row justify-evenly border-solid border-t-2 border-gray-200'}>
                <button onClick={() => {
                    if (appContext !== null) {
                        setDescription("")
                        setName("")
                        appContext.setCurrentTaskId(null)
                    }
                    setModalIsOpen(false)
                }}>
                    <img src={CollapseArrow} className={'transform rotate-180'} alt={"Close"} />
                </button>
                <button onClick={dispatchTaskDelete}>
                    <img src={BlackTrash} alt={'delete task'} />
                </button>
            </div>
        </div>
    )
}
