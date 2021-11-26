import React from "react";
import {AppContext, GlobalContext, TaskEntry} from "../../App";
import "./List.css";
import PlusOrange from "../../img/plus-orange.svg";
import getTasks from "../../services/tasks/getTasks";
import createTask from "../../services/tasks/createTask";
import updateTask from "../../services/tasks/updateTask";
import ListOptions from "../Modals/ListOptions";
import TaskEdit from "../Modals/TaskEdit";

export async function changeTaskStatus(appContext: GlobalContext, taskId: string | number) {
    const oldTask = Object.values(appContext.tasksObj).find(t => t.id === taskId);
    if (typeof oldTask === 'undefined') {
        return;
    }
    const alteredTask = {
        name: oldTask.name,
        description: oldTask.description,
        status: oldTask.status === 'completed' ? 'completed' : 'open'
    };
    await updateTask(appContext, taskId, alteredTask);
}

export default function List() {
    const appContext = React.useContext(AppContext);
    if (appContext === null) {
        throw new Error('AppContext is empty');
    }

    const currentList: any = Object.values(appContext.listsObj).find(t => t.id === appContext.currentListId);

    const [taskEditModalIsOpen, setTaskEditModalIsOpen] = React.useState<boolean>(false);
    const [listOptionsModalIsOpen, setListOptionsModalIsOpen] = React.useState<boolean>(false);

    const [taskComponents, setTaskComponents] = React.useState<JSX.Element[]>([]);

    React.useEffect(() => {
        setTaskEditModalIsOpen(false);
        if (appContext.currentListId !== null) {
            getTasks(appContext);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appContext.currentListId]);

    React.useEffect(() => {
        const newListButton = (key: React.Key, task: TaskEntry) => {
            const ctx = appContext as GlobalContext;
            return (
                <div className={'todo-tasks-list-item'} key={key} onClick={() => {
                    ctx.setCurrentTaskId(task.id);
                    setTaskEditModalIsOpen(true)
                }}>
                    <input type="checkbox" name="task status" className={'mr-7'}
                        checked={(task.status === 'completed')} onChange={(event) => {
                        changeTaskStatus(ctx, task.id as string | number)
                    }}
                    />
                    <span className={task.status === 'completed' ? ' line-through ' : ''}>
            {task.name}
          </span>
                </div>
            )
        }

        if (Object.keys(appContext.tasksObj).length > 0) {
            const arr: JSX.Element[] = [];
            let key = 0;
            for (let [, taskEntry] of Object.entries(appContext.tasksObj)) {
                arr.push(newListButton(key++, taskEntry));
            }
            setTaskComponents(arr);
        } else {
            setTaskComponents([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appContext.tasksObj]);
    return (
        <>
            {
                (appContext.currentListId === null) ?
                    (<div className={'h-full flex-col flex justify-center items-center'}>
                        <span style={{color: '#FCD620'}} className={"text-xl font-semibold"}>List not found</span>
                        <span>We can't find the list you're looking for. Select one of your lists from the sidebar or
                            create a new list.</span>
                    </div>) :
                    (
                        <div className={'flex flex-row h-full'}>
                            <div className={'w-full ml-4 mt-5'}>
                                <div>
                                    <button type={'button'}
                                        onClick={() => setListOptionsModalIsOpen(!listOptionsModalIsOpen)}>
                                <span
                                    className={'text-xl text-black font-semibold'}>{currentList.name || 'UNKNOWN LIST'} •••</span>
                                    </button>
                                    <button onClick={() => createTask(appContext)}
                                        className={'mt-5 flex flex-row justify-start items-center create-task-btn'}>
                                        <img src={PlusOrange} alt="" style={{width: '15.33px', height: '15.33px'}}
                                            className={'mr-3'} />
                                        <span className={'text-black'}>Add a task</span>
                                    </button>
                                    {taskComponents}
                                </div>
                            </div>

                            {taskEditModalIsOpen ? <TaskEdit setModalIsOpen={setTaskEditModalIsOpen} /> : null}
                        </div>
                    )
            }

            {listOptionsModalIsOpen ? (
                <ListOptions
                    setListOptionsModalIsOpen={setListOptionsModalIsOpen}
                />) : null}
        </>
    )
}
