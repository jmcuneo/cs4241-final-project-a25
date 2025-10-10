import {useNavigate} from "react-router";
import UserIcon from "./UserIcon.tsx"
import WelcomeMessage from "./WelcomeMessage.tsx"

export default function NoUserNav() {
    const navigate = useNavigate();

    return (
        <div className="navbar bg-base-100 shadow-sm px-2">
            <div className="navbar-start">
                <img className="btn btn-ghost text-xl" 
                    src= {'/HeatifyLogo.png'}
                    width={50} height={50} 
                    alt='Heatify Logo'
                    onClick={() => navigate("/")}/>

                <span className="text-xl font-bold">Heatify</span>
            </div>
            <div className="navbar-end">
                <div className="mr-4">
                    <WelcomeMessage/>
                </div>
                <UserIcon/>
            </div>
        </div>
    );
}