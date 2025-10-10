import React from "react";

function Instructions() {

    return (
        <div>
            <br/>
            <div className="nes-container with-title is-centered instructions-container">
                <h1 className="title">Instructions</h1>
                <ol className="instructions">
                    <br/>
                    <li>Make the given pizza orders in the time given.</li>
                    <li>Click on each <span className="nes-text is-primary">ingredient</span> to add it to the pizza.</li>
                    <li>Click the <span className="nes-text is-error">trash</span> button if you mess up an order.</li>
                    <li>Click <span className="nes-text is-error">bake</span> to send your finished pizza into the oven.</li>
                    <li>Once it has baked, click <span className="nes-text is-success">sell</span> to submit the order.</li>
                    <li>Click on the <span className="nes-text is-warning">buy</span> button under each ingredient <br/> when you run out to get more.</li>
                    <li>Different orders are worth different prices, <br/> the goal is to make as much revenue <i className="nes-icon coin is-small"></i> as you can!</li>
                </ol>
            </div>
        </div>
    );
}

export default Instructions;