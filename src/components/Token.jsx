import { useSearchParams } from "react-router-dom";
import API from "../utils/API.js";

function Token() {
    const [searchParams, setSearchParams] = useSearchParams();

    async function createTokenAndId() {
        const result = await API.verifyToken({ token: searchParams.get("token") });
        if (result.data.success === true) {
            await localStorage.setItem("token", searchParams.get("token"));
            await localStorage.setItem("id", result.data.id)
            window.location = "/dashboard";
        }
        else {
            alert(result.data.message)
        }
    }

    createTokenAndId();
}

export default Token;