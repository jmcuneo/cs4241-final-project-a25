const TOPPINGS = ['pepperoni', 'mushroom', 'olive', 'pepper'];

export function generateOrder() {
    const extraTop = Math.floor(Math.random() * 5);
    let price = 5;

    const chosenExtras = TOPPINGS
        .sort(() => 0.5 - Math.random())
        .slice(0, extraTop);

    const toppings = ['sauce', 'cheese', ...chosenExtras];

    for (let i = 0; i < extraTop + 2; i++) {
        if (toppings[i] === 'pepperoni' || toppings[i] === 'mushroom') {
            price += 2;
        } else if (toppings[i] === 'olive' || toppings[i] === 'pepper') {
            price += 1;
        }
    }

    return {
        id: crypto.randomUUID(), // give order random id
        toppings,
        price,
    }
}