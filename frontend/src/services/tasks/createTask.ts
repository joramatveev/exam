import getTasks from "./getTasks";
import {GlobalContext} from "../../App";

export default async function createTask(appContext: GlobalContext) {
    const newTaskId = await fetch(`/todo/lists/${appContext.currentListId}/tasks`, {
        method: 'POST',
        headers: new Headers({
            'Authorization': `Bearer ${appContext.jwtToken}`
        }),
        body: JSON.stringify({
            task_name: "New task",
            description: "",
        })
    }).then(data => data.text());

    if (newTaskId) {
        await getTasks(appContext);
    }
}
