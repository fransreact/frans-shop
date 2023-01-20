import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
export default function LogoutComponent() {
    const navigate = useNavigate()
    const rmvStorage = async() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        navigate("/")
    }

    useEffect(() => {
        rmvStorage();
    });
}