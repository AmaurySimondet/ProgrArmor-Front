import API from './API';

async function getProgrammes(query = {}) {
    const { data } = await API.getProgrammes(query);
    if (data.success === true) {
        return (data.programmes)
    }
    else {
        alert(data.message)
        return null
    }
}

export { getProgrammes }