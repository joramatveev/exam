import getLists from "./getLists";
import {GlobalContext} from "../../App";

/**
 * Delete List Properties
 */
type DeleteListProps = {
    appContext: GlobalContext,
    listId: number | string | null
}

/**
 * Delete List
 * @param {Object} appContext
 * @param {Number} listId
 */
export default async function deleteList({appContext, listId}: DeleteListProps) {
    const response = await fetch(`/todo/lists/${listId}`, {
        method: 'DELETE',
        headers: new Headers({'Authorization': `Bearer ${appContext.jwtToken}`})
    }).then(data => data.text());

    if (response !== '') {
        throw new Error('Delete list error');
    } else {
        appContext.setCurrentListId(null);
        appContext.setCurrentTaskId(null);
        await getLists(appContext);
    }
}
