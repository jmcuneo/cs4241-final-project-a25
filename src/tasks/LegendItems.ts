import LegendItem from "./LegendItem"

const legendItems = [
    new LegendItem(
        "21+",
        "#032a11ff",
        (cases) => cases >= 21,
        "white"
    ),
    new LegendItem(
        "16 - 20",
        "#0a672aff",
        (cases) => cases >= 16 && cases < 21,
        "white"
    ),
    new LegendItem(
        "11 - 15",
        "#1DB954",
        (cases) => cases >= 11 && cases < 16,
        "white"
    ),
     new LegendItem(
        "6 - 10",
        "#4de382ff",
        (cases) => cases >= 6 && cases < 11,
        "white"
    ),
     new LegendItem(
        "1 - 5",
        "#97e9b4ff",
        (cases) => cases > 0 && cases < 6,
        "white"
    ),
    new LegendItem(
        "0",
        "#404040ff",
        () => true,
        "white"
    ),
    
];

export default legendItems;