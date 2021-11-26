import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export type NewTaskObject = {
    name: string,
    description: string,
    status: string
}

export default async function updateTask(appContext: GlobalContext, taskId: number | string, newTaskObj: { name: string; description: string; status: string }) {
    const response = await fetch(`/todo/lists/${appContext.currentListId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': `Bearer ${appContext.jwtToken}`
        }),
        body: JSON.stringify({
            task_name: newTaskObj.name,
            description: newTaskObj.description,
            status: newTaskObj.status !== null ? (newTaskObj.status === 'open' ? 'completed' : 'open') : undefined
        })
    }).then(data => data.text());

    switch (response) {
        case 'cannot extract list id':
        case 'cannot extract task id':
        case 'requested list does not exits':
        case 'requested task does not exits':
        case 'could not read params':
            break;
        case 'updated':
        default:
            await getTasks(appContext);
    }
}
