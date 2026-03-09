
export const getVerifyUser = async () => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    try {
          const res = await fetch(`${backend_url}/users/verify`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);
            return data
    } catch (error) {
        console.log(error)
    }
}