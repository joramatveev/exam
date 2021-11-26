import {GlobalContext} from "../../App";
import {helper} from '../../services/helper'

export default async function getLists(appContext: GlobalContext) {
    const response = await fetch('/todo/lists', {
        method: 'GET',
        headers: new Headers({'Authorization': `Bearer ${appContext.jwtToken}`})
    }).then(data => data.json());

    if (response !== null) {
        if (Object.keys(response).length > 0) {
            appContext.setListsObj(response.sort(helper.dynamicSort('id')));
        } else {
            appContext.setListsObj({});
        }
    } else {
        appContext.setListsObj({});
    }
}
