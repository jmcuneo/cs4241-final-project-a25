import NoUserNav from "./components/noUserNav.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";

export default function Home() {
    const navigateToLogin = () => {
        window.location.href = "/api/login";
    }

    return (
        <div className="h-screen flex flex-col">
            <NoUserNav/>
            <div className="flex-1 relative">
                <BackgroundVideo/>
                <div className="absolute inset-0 flex flex-col items-start justify-center w-1/3 ml-12 animate-fade-in">
                    <span className="text-white text-8xl font-bold mb-8">Visualize Your Music</span>
                    <div className={"flex flex-row gap-4"}>
                        <button className="btn btn-primary" onClick={navigateToLogin}>Try Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}