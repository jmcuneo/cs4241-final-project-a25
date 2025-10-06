"use client"
import GameClient from "@/components/GameClient";
import GameConnection from "@/components/GameConnection";

const Index = () => {
    return (
        <div>
            <GameConnection deck={["1h", "8c", "2d", "4d", "3s"]} onPlay={() => null} onPlayEnd={ () => null } />
        </div>
    );
};

export default Index;
