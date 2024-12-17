import API from "./API";


async function createTokenAndId() {
    const result = await API.verifyToken({ token: localStorage.getItem("token") });
    if (result.data.success === true) {
        window.location = "/dashboard";
    }
    else {
        console.log(result.data.message)
    }
}

export default createTokenAndId;