"use client"
import Game from "@/components/Game";

const Index = () => {
    return (
        <div>
            <Game deck={["h1", "c8", "d2", "d4", "s3"]} onPlay={() => null} onPlayEnd={ () => null } />
        </div>
    );
};

export default Index;
