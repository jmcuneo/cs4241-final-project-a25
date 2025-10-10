const messages = [
    "Loading your personalized data",
    "Fetching the latest updates",
    "Preparing your data",
    "Almost there, just a moment",
    "Getting things ready for you",
    "Hopefully you didn't listen to AJR",
    "Summoning the data gremlins",
    "Calculating your music map",
    "Brewing some coffee",
    "Warming up the servers",
    "Attempting to get an A in CS4241",
    "Cuneo is the best professor",
    "Patience is a virtue",
    "I hope there isn't a merge conflict",
    "Cam coded this part, this might take a while",
    "People that take the Unity elevator for one floor should be expelled",
    "Reticulating splines",
];


export default function Loading() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return (
        <div className={"h-screen flex flex-row items-center justify-center gap-x-1"}>
            <p className={"text-3xl"}>{messages[randomIndex]}</p>
            <span className="loading loading-dots loading-2xl mt-5"></span>
        </div>
    );
}