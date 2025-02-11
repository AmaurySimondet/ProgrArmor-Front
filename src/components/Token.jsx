import { useSearchParams } from "react-router-dom";
import API from "../utils/API.js";

function Token() {
    const [searchParams] = useSearchParams();

    async function createTokenAndId() {
        const token = searchParams.get("token");
        const redirectUrl = searchParams.get("redirect");

        const result = await API.verifyToken({ token });
        if (result.data.success === true) {
            await localStorage.setItem("token", token);
            await localStorage.setItem("id", result.data.id);
            window.location = redirectUrl || "/dashboard";
        }
        else {
            console.log(result.data.message)
        }
    }

    createTokenAndId();
}
export default Token;