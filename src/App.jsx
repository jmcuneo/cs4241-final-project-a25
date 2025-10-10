import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Game from "./Components/Game.jsx";
import Homepage from "./Components/Homepage.jsx";
import {useState} from "react";

function App() {

    const [width, setWidth] = useState(window.innerWidth*.9);
    const [height, setHeight] = useState(window.innerHeight*.9);

    const handleResize = () => {
        setWidth(window.innerWidth*.9);
        setHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);

    const gameDataStorage = [
        {
            name: "Battleship",
            author: "Aaron",
            thumbnail: "/thumbnail.png",
            link: "https://battleship-v68e.onrender.com",
            description: "The classic game made by hasbro that allows a user to play against another person connected to the website.",
        },
        {
            name: "Squish-The-Cockroach",
            author: "Tien Nguyen",
            thumbnail: "/Squish_the_cockroach.png",
            link: "https://cockroach-squish.onrender.com/",
            description: "This game is for anyone who enjoys the calming feel of tap-and-click interactions. In a quick 30-second round, squish as many cockroaches as you can—each squish earns a credit. Log in at the end to save your score. Simple by design, it taps into self-regulation through sensory input: repetitive, small actions that can help ease stress, anxiety, and boredom."
        },
        {
            name: "1000 Clicks in 10 minutes",
            author: "Benedict Antwi",
            thumbnail: "/1000_clicks.png",
            link: "https://benedictantwi-gameentry.onrender.com/",
            description: "The user is challenged to get 1,000 points within a timeframe of 10 minutes. To gain a point, the user can simply click on a button and it will add a point. However, the user can also trade points to gain powerups which could help them get points in a quicker timeframe. While the user will have 10 minutes to complete the challenge, it's best they complete it as fast as possible"
        },
        {
            name: "Trust AI?!?!",
            author: "Aditya Patel",
            thumbnail: "/Trust.png",
            link: "https://ap-trust-ai.onrender.com",
            description: "a web-based trivia bluff game, where trivia questions will be generated dynamically using AI so each round is unique. The AI opponent will give answers that may be true or bluff. Players will see the question, the AI’s answer, their current score and round, and buttons to Trust or Call Bluff, along with power-ups like Fact Check and Double Down. Points are earned or lost based on correct decisions, and a final score is displayed at the end, creating an interactive challenge of knowledge and intuition."
        },
        {
            name: "Unscramble",
            author: "Aishwarya",
            thumbnail: "/Aishu.png",
            link: "https://unscramble-word-game.onrender.com",
            description: "A word puzzle game where the user has to unscramble a series of letters to identify the real word. The goal of the game is to unscramble as many words as possible within 60 seconds. They can choose between different categories such as food, places, or animals. A score counter and timer will be on display and every word guessed is one point. If a word is guessed incorrectly the user can skip the word or try again. There will be a top 5 leaderboard to track points."
        }

    ]
  return (
    <>
        <div className="m-auto p-auto bg-gray-500" style={{height:`${height}px`}}>
        <BrowserRouter>
            <nav className={"m-10 p-10 bg-gray-300 border-1 rounded-xl"} style={{width:`${width}px`, display:'flex', justifySelf: "center", justifyContent:'center', gap:'10px'}}>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/">Home</Link>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/game1">{gameDataStorage[0]["name"]}</Link>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/game2">{gameDataStorage[1]["name"]}</Link>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/game3">{gameDataStorage[2]["name"]}</Link>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/game4">{gameDataStorage[3]["name"]}</Link>
                <Link className={"p-4 m-3 bg-gray-200 border-2 border-black rounded-xl"} to="/game5">{gameDataStorage[4]["name"]}</Link>

            </nav>
            <Routes>
                <Route path="/" element={<Homepage gameDataStorage={gameDataStorage} height={height}/>}/>
                <Route path="/game1" element={<Game height={height*.8} width={width} link={gameDataStorage[0]["link"]} id={"game1"} key={"game1"} title={gameDataStorage[0]["name"]}/>}/>
                <Route path="/game2" element={<Game height={height*.8} width={width} link={gameDataStorage[1]["link"]} id={"game2"} key={"game2"} title={gameDataStorage[1]["name"]}/>}/>
                <Route path="/game3" element={<Game height={height*.8} width={width} link={gameDataStorage[2]["link"]} id={"game3"} key={"game3"} title={gameDataStorage[2]["name"]}/>}/>
                <Route path="/game4" element={<Game height={height*.8} width={width} link={gameDataStorage[3]["link"]} id={"game4"} key={"game4"} title={gameDataStorage[3]["name"]}/>}/>
                <Route path="/game5" element={<Game height={height*.8} width={width} link={gameDataStorage[4]["link"]} id={"game5"} key={"game5"} title={gameDataStorage[4]["name"]}/>}/>
            </Routes>


        </BrowserRouter>
        </div>
    </>
  )
}

export default App
