import getLists from "./getLists";
import {GlobalContext} from "../../App";

type CreateListProps = {
    appContext: GlobalContext,
    newName: string | number | null
}

// Renames currently selected list
export default async function renameList({appContext, newName}: CreateListProps) {
    const response = await fetch(`/todo/lists/${appContext.currentListId}`, {
        method: 'PUT',
        headers: new Headers({'Authorization': `Bearer ${appContext.jwtToken}`}),
        body: JSON.stringify({'name': newName})
    }).then(data => data.text());

    switch (response) {
        case 'could not read params':
        case 'cannot extract list id':
        case 'requested list does not exits':
            break;
        default:
            getLists(appContext);
    }
}
