import {useEffect, useState} from 'react'
import './styles/App.css'
import Timer from './components/Timer.jsx'
import Popup from "./components/Popup.jsx";
import "nes.css/css/nes.min.css"
import OrderList from './components/OrderList.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import {generateOrder} from "./components/generateOrder.jsx";
import { getCurrentUser, logout, saveGameSession } from './utils/api.js';
import sauceIcon from './sprites/sauceIcon.png';
import cheeseIcon from './sprites/cheeseIcon.png';
import pepperoniIcon from './sprites/pepperoniIcon.png';
import mushroomIcon from './sprites/mushroomIcon.png';
import oliveIcon from './sprites/oliveIcon.png';
import pepperIcon from './sprites/pepperIcon.png';
import pizzaBase from './sprites/base.png';
import sauce from './sprites/sauce.png';
import cheese from './sprites/cheese.png';
import mushroom from './sprites/mushroom.png';
import pepperoni from './sprites/pepperoni.png';
import pepper from './sprites/pepper.png';
import olive from './sprites/olive.png';
import oven from './sprites/oven.png';
import Instructions from "./components/Instructions.jsx";

const sprites = {
    pizzaBase,
    sauce,
    cheese,
    pepperoni,
    mushroom,
    pepper,
    olive,
    oven
}

function Header({user, onLogout, activeTab, setActiveTab, resetGame}) {
    return (
        <div className="header">
            <span className="nes-text is-primary" id="title">Bad Pizza, Sad Pizza</span>
            <p id="userInfo">Welcome {user.username}!</p>
            <div className="navigation">
                <button
                    type="button"
                    className={`nes-btn ${activeTab === 'game' ? 'is-primary' : ''}`}
                    onClick={() => {
                        setActiveTab('game')
                    }}
                >
                    Game
                </button>
                <button
                    type="button"
                    className={`nes-btn ${activeTab === 'instructions' ? 'is-primary' : ''}`}
                    onClick={() => {
                        setActiveTab('instructions')
                        resetGame()
                    }}
                >
                    How To Play
                </button>
                <button
                    type="button"
                    className={`nes-btn ${activeTab === 'leaderboard' ? 'is-primary' : ''}`}
                    onClick={() => {
                        setActiveTab('leaderboard')
                        resetGame()
                    }}
                >
                    Leaderboard
                </button>
                <button type="button" className="nes-btn is-error" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

function HomePage() {
    const githubAuthUrl = import.meta.env.VITE_GITHUB_AUTH_URL || 'http://localhost:3001/auth/github';

    return (
        <div className="homePage">
            <span className="nes-text is-primary" id="mainHeader">Bad Pizza, Sad Pizza</span>
            <p id="userInfo">Sign in to start!</p>
            <div className="loginPage">
                <a className="nes-btn" href={githubAuthUrl} id="loginButton">Sign In with Github</a>
            </div>
        </div>
    )
}

function GameplayArea({handleClick, handleTrash, handleBuy, handleSell, orders, ingredients, revenue, currentPizza, onTimeUp, handleBake, isBaking, baked, resetProgress}) {
    const handleTimeUp = () => {
        onTimeUp();
    };

    return (
        <div className="nes-container with-title is-centered container gameplay-area">
            {/* Orders */}
            <div className="orders">
                <OrderList orders={orders} />
                <div id="timer-container" className="nes-container is-rounded">
                    <Timer duration={120} onTimeUp={handleTimeUp} />
                </div>
            </div>

            {/* Ingredients & Buy */}
            <div id="ingredient-container" className="ingredients">
                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('sauce')}>Sauce: {ingredients.sauce}
                        <br/><img className="icon" src={sauceIcon} alt="sauce" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('sauce')}>Buy FREE</button>
                </div>

                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('cheese')}>Cheese: {ingredients.cheese}
                        <br/><img className="icon" src={cheeseIcon} alt="cheese" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('cheese')}>Buy FREE</button>
                </div>

                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('pepperoni')}>Pepperoni: {ingredients.pepperoni}
                        <br/><img className="icon" src={pepperoniIcon} alt="pepperoni" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('pepperoni')}>Buy 5/$8</button>
                </div>

                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('mushroom')}>Mushroom: {ingredients.mushroom}
                        <br/><img className="icon" src={mushroomIcon} alt="mushroom" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('mushroom')}>Buy 5/$8</button>
                </div>

                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('pepper')}>Pepper: {ingredients.pepper}
                        <br/><img className="icon" src={pepperIcon} alt="pepper" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('pepper')}>Buy 5/$4</button>
                </div>

                <div className="ingredient-pair">
                    <button type="button" className="nes-btn is-primary ingredient-btn" disabled={isBaking} onClick={() => handleClick('olive')}>Olive: {ingredients.olive}
                        <br/><img className="icon" src={oliveIcon} alt="olive" />
                    </button>
                    <button type="button" className="nes-btn is-warning buy-btn" onClick={() => handleBuy('olive')}>Buy 5/$4</button>
                </div>
            </div>

            <div className="kitchen">
                {/* Pizza */}
                <div id="pizza-container" className="nes-container is-rounded pizza-container">
                    <div className={`whole-pizza ${isBaking ? 'baking' : ''}`}>
                        <img src={pizzaBase}
                             alt="pizza base"
                             className="pizza-base"
                             style={{ width: '400px', height: '400px' }} />
                        {currentPizza.map((ingredient, index) => (
                            <img
                                key={index}
                                src={sprites[ingredient]}
                                alt={ingredient}
                                className={`topping topping-${ingredient}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Oven */}
                <div className="oven-container">
                    <img id="oven" src={oven} alt="oven" style={{ width: '505px', height: '505px' }} />
                </div>
            </div>

            {/* Trash/Bake/Sell Buttons, Revenue, and Progress Bar */}
            <div className="footer">
                <button type="button" className="nes-btn is-error" disabled={isBaking}
                        onClick={() => handleTrash()}>Trash
                </button>

                <p className="revenue">Revenue: ${revenue}</p>
                <div className="actions">
                    <button type="button" className="nes-btn is-error" disabled={isBaking}
                            onClick={() => handleBake()}>Bake
                    </button>
                    <button type="button" className="nes-btn is-success" disabled={isBaking} onClick={handleSell}>Sell
                    </button>

                    <div className="progress-bar">
                        <div className={`progress-fill ${isBaking ? 'active' : baked ? 'full' : ''} ${resetProgress ? 'reset' : ''}`}
                             style={{transitionDelay: '1500ms', transitionDuration: '1500ms'}}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function App() {
    const [ingredients, setIngredients] = useState({
        sauce: 10,
        cheese: 10,
        pepperoni: 10,
        mushroom: 10,
        pepper: 10,
        olive: 10
    })

    const [orders, setOrders] = useState(() =>
        Array.from({length: 3}, () => generateOrder())
    );

    const [revenue, setRevenue] = useState(20)
    const [currentPizza, setCurrentPizza] = useState([])
    const [user, setUser] = useState(null)
    const [_gameFinished, setGameFinished] = useState(false)
    const [pizzasSold, setPizzasSold] = useState(0)
    let [activeTab, setActiveTab] = useState('instructions')
    const [popupMessage, setPopupMessage] = useState([]);
    const [isBaking, setIsBaking] = useState(false);
    const [baked, setBaked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [resetProgress, setResetProgress] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const showPopup = (message) => {
        const id = Date.now();
        setPopupMessage((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setPopupMessage((prev) => prev.filter((p) => p.id !== id));
        }, 1500);
    };

    // Load user on component mount
    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleClick = (ingredient) => {
        if (currentPizza.includes(ingredient)) {
            showPopup(ingredient + " is already on the pizza!");
            return;
        }

        if (ingredients[ingredient] <= 0) {
            showPopup(ingredient + " needs to be restocked!");
            return;
        }

        setIngredients(prevStock => ({
            ...prevStock,
            [ingredient]: prevStock[ingredient] - 1,
        }));

        setCurrentPizza(prev => [...prev, ingredient]);
    }

    const handleBuy = (ingredient) => {
        const ingredientPrices = {
            pepperoni: 8,
            mushroom: 8,
            olive: 4,
            pepper: 4,
        };

        const price = ingredientPrices[ingredient] || 0;

        if (price > 0 && revenue - price < 0) {
            showPopup("Insufficient funds!");
        } else {
            setIngredients(prev => ({
                ...prev,
                [ingredient]: prev[ingredient] + 5,
            }));

            if (price > 0) {
                setRevenue(prev => prev - price);
            }
        }
    }

    const handleSell = () => {
        if (orders.length === 0) return showPopup("No orders!");

        if (!baked) {
            showPopup("Pizza must be baked!");
            return;
        }

        const sortedPizza = [...currentPizza].sort();
        console.log("sorted pizza: " + sortedPizza);

        const matchingIndex = orders.findIndex(order => {
            const sortedOrder = [...order.toppings].sort();
            console.log("sorted order: " + sortedOrder);
            return (
                sortedPizza.length === sortedOrder.length &&
                sortedPizza.every((topping, i) => topping === sortedOrder[i])
            );
        });

        if (matchingIndex === -1) {
            showPopup("Wrong pizza! Customer rejected it.");
        } else {
            const order = orders[matchingIndex];
            setRevenue(prev => prev + order.price);
            setPizzasSold(prev => prev + 1);
            showPopup("Sold order for $" + order.price + "!");

            setOrders(prev => {
                const newOrders = [...prev];
                newOrders.splice(matchingIndex, 1);
                newOrders.push(generateOrder());
                return newOrders;
            })
        }

        setCurrentPizza([]);
        setResetProgress(true);
        setBaked(false);
    };

    const handleTrash = () => {
        setCurrentPizza([]);
        setBaked(false);
    }

    const resetGame = () => {
        setIngredients({
            sauce: 10,
            cheese: 10,
            pepperoni: 10,
            mushroom: 10,
            pepper: 10,
            olive: 10
        });
        setRevenue(20);
        setCurrentPizza([]);
        setResetProgress(true);
        setPizzasSold(0);
        setIsBaking(false);
        setBaked(false);
    }

    const handleTimeUp = async () => {
        if (hasSaved) return;  // prevent double save
        setHasSaved(true);

        setGameFinished(true);
        setGameOver(true);

        // Save game session if user is logged in
        if (user) {
            try {
                await saveGameSession({
                    userId: user.id,
                    username: user.username,
                    pizzasSold: pizzasSold,
                    revenue: revenue,
                    gameTime: 120 // 2 minutes in seconds
                });
                console.log('Game session saved successfully');
            } catch (error) {
                console.error('Failed to save game session:', error);
            }
        }
    };

    const handleBake = () => {
        if (baked) {
            showPopup("Pizza was already baked!");
            return;
        }

        setIsBaking(true);
        setResetProgress(false);
        setBaked(false);

        setTimeout(() => {
            setIsBaking(false);
            setBaked(true);
        }, 3000)
    }

    if(!user) {
        return (
            <>
                <HomePage />
            </>
        )
    }

    return (
        <div className="gamePage">
            <Header user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} setRevenue={setRevenue} resetGame={resetGame} />
            {activeTab === 'game' ? (
                <GameplayArea handleClick={handleClick}
                              handleTrash={handleTrash}
                              handleBuy={handleBuy}
                              handleSell={handleSell}
                              orders={orders}
                              ingredients={ingredients}
                              revenue={revenue}
                              currentPizza={currentPizza}
                              onTimeUp={handleTimeUp}
                              handleBake={handleBake}
                              isBaking={isBaking}
                              baked={baked}
                              resetProgress={resetProgress}
                />
            ) : activeTab === 'instructions' ? (
                    <div className="instructions">
                        <Instructions />
                        <button className="nes-btn is-success"
                                onClick={() => setActiveTab('game')}
                                style={{
                                    marginLeft: '380px',
                                    marginTop: '35px',
                                    height: '75px',
                                    justifyContent: 'center',
                                    fontSize: '30px',
                                }}
                        >Play!</button>
                    </div>
            ) : (
                    <Leaderboard />
            )}

            {gameOver && (
                <div className="overlay">
                    <div className="gameover-popup nes-container is-rounded with-title">
                        <p className="title">Time’s Up!</p>
                        <p>You sold {pizzasSold} pizzas and earned ${revenue}!</p>
                        <button
                            type="button"
                            className="nes-btn is-success"
                            onClick={() => {
                                setGameOver(false);
                                setGameFinished(true);
                                setActiveTab('leaderboard');
                                setHasSaved(false);
                                resetGame();
                            }}
                        >
                            View Leaderboard
                        </button>
                    </div>
                </div>
            )}

            {popupMessage.map((p) => (
                <Popup
                    key={p.id}
                    message={p.message}
                />
            ))}
        </div>
    )
}

export default App