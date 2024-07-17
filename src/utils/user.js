import API from './API';
import { sortDateCroissant } from './utils';

async function getUser(id) {
    const { data } = await API.getUser({ id: id });
    if (data.success === false) {
        console.log(data.message);
    } else {
        // console.log(data.profile);
        if (data.profile.modeSombre && data.profile.modeSombre === true) {
            // 👇 add class to body element
            document.body.classList.add('darkMode');
        }
        return data.profile;
    };
}

async function getUserById(id) {
    const { data } = await API.getUser({ id: id });
    if (data.success === false) {
        console.log("getuserbyid", data.message);
        return null, null;
    } else {
        console.log("getuserbyid", data.profile);
        return { profile: data.profile, lastSeance: data.seances.sort(sortDateCroissant).slice(-1)[0] };
    };
}

async function getProgrammesByUser(id) {
    const { data } = await API.getProgrammesByUser({ userId: id });
    if (data.success === false) {
        console.log("getProgrammeByUser", data.message);
        return null;
    } else {
        console.log("getProgrammeByUser", data.programmes);
        return data.programmes;
    };
}

export { getUser, getUserById, getProgrammesByUser }