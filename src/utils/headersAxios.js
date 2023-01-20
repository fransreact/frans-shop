const token = localStorage.getItem("token")
export const headersAxios = {
    Authorization: "Bearer " + token
}