import API from './API';

async function getUserById(id) {
    const { data } = await API.getUser({ id: id });
    if (data.success === false) {
        alert(data.message);
    } else {
        return data.profile;
    };
}

export { getUserById }