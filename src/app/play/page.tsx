"use client"
import Game from "@/components/Game";

const Index = () => {
    return (
        <div>
            <Game deck={["1h", "8c", "2d", "4d", "3s"]} onPlay={() => null} onPlayEnd={ () => null } />
        </div>
    );
};

export default Index;
