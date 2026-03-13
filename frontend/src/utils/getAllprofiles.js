const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getAllprofiles = async () => {
   const res = await fetch(`${backend_url}/chatroom/chats/profiles`, {
      method: "GET",
      credentials: "include"
    })
    const data = await res.json()
    return data;
  }
