import axios from "axios";
import {useEffect, useState} from "react";

export default function UserIcon(){
    const access_token = localStorage.getItem('access_token');
    const [icon, setIcon] = useState("");

    useEffect(() => {
        let mounted = true;
        if (!access_token) return;

        const getIcon = async function(){
            if (!access_token) {
                console.error("No access token found");
                return;
            }

            try{
                const res1 = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + access_token
                    },
                })
                const userIcon = res1.data.images[0].url;
                if (mounted) setIcon(userIcon);
            } catch (error) {
                console.error("Error fetching user profile picture: ", error);
            }
        }

        getIcon();
        return () => {
            mounted = false;
        };
    }, [access_token]);
    

    if (icon){
        return(
            <img src={icon} alt="" className={"w-12 h-12 rounded-full object-cover object-center"} />
        )
    }

}