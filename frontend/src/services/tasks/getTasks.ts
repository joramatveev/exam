import {GlobalContext} from "../../App";
import {helper} from "../helper";

/**
 * Get Tasks List
 * @param {Object} appContext
 */
export default async function getTasks(appContext: GlobalContext) {
    if (appContext.currentListId !== null) {
        const response = await fetch(`/todo/lists/${appContext.currentListId}/tasks`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${appContext.jwtToken}`
            })
        }).then(data => data.json());
        if (response !== null) {
            if (helper.has(response, 'error')) {
                console.log(response.error);
                return false;
            } else if (Object.keys(response).length > 0) {
                appContext.setTasksObj(response.sort(helper.dynamicSort('id')));
            } else {
                appContext.setTasksObj({})
            }
        } else {
            appContext.setTasksObj({})
        }
    }
}
