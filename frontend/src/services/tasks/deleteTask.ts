import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export default async function deleteTask(appContext: GlobalContext, taskId: string | number) {
    if (appContext.currentListId !== null) {
        const tasks = await fetch(`/todo/lists/${appContext.currentListId}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': `Bearer ${appContext.jwtToken}`
            })
        }).then(data => data.text());

        switch (tasks) {
            case 'cannot extract list id':
            case 'cannot extract task id':
            case 'requested list does not exits':
            case 'requested task does not exits':
                break;
            case 'deleted':
            default:
                getTasks(appContext);
        }
    }
}
