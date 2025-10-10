import {useEffect, useRef} from "react";

export default function BackgroundVideo() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const slowDownStart = video.duration * 0.8;

        const handleTimeUpdate = () => {
            if (!video) return;
            const current = video.currentTime;
            if (current > slowDownStart) {
                const remaining = video.duration - current;
                video.playbackRate = Math.max(0.1, remaining / (video.duration * 0.2));
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={"world_map.mp4"}
            autoPlay
            muted
            className={"w-full h-full object-cover absolute top-0 left-0"}
        />
    );
}
