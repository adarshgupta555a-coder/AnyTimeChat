
export const getVerifyUser = async () => {
    try {
          const res = await fetch("http://localhost:3000/users/verify", {
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