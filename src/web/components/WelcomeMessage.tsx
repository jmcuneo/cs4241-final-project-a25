import axios from "axios";
import {useState, useEffect} from "react";

export default function WelcomeMessage(){
    const access_token = localStorage.getItem('access_token');
    const [username, setUsername] = useState("");

    useEffect(() => {
        let mounted = true;
        if (!access_token) return;

        const getUsername = async () => {
            try {
                const res = await axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        Authorization: "Bearer " + access_token,
                    },
                });
                if (mounted) setUsername(res.data?.display_name ?? "");
            } catch (error) {
                if (mounted) console.error("Error fetching username:", error);
            }
        };

        getUsername();
        return () => {
            mounted = false;
        };
    }, [access_token]);

    if (username){
        return(
            <p className={"font-bold"}> Welcome, {username}!</p>
        )
    }
    else{
        return(
            <p className={"font-bold"}> Log in to get started!</p>
        )
    }
}
