/**
 * Get user info (checkAuth method)
 * @return {Boolean}
 */
export default async function userInfo() {
    const jwtToken = localStorage.getItem('jwtToken') || null;
    if (!jwtToken) {
        return false;
    }
    try {
        const response = await fetch('/user/me', {
            method: 'GET',
            headers: new Headers({'Authorization': `Bearer ${jwtToken}`})
        });
        return response.ok;
    } catch (e) {
        console.log(e);
    }
    return false;
}
