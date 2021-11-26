import getLists from "./getLists";
import {GlobalContext} from "../../App";

/**
 * Create List Properties
 */
export type CreateListProps = {
    appContext: GlobalContext,
    listName: string
}

/**
 * Create List Of Tasks
 * @param {Object} appContext
 * @param {String} listName
 * @return {Object}
 */
export default async function createList({appContext, listName}: CreateListProps) {
    const response = await fetch('/todo/lists', {
        method: 'POST',
        headers: new Headers({'Authorization': `Bearer ${appContext.jwtToken}`}),
        body: JSON.stringify({name: listName})
    }).then(data => data.json());
    if (response !== null) {
        console.log(response)
    }
    await getLists(appContext);
}
