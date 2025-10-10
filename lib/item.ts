import type Artist from "./artist.ts";

// there are many other fields, but we only care about artists for now
export default interface Item {
    track: {
        artists: Artist[];
    }
}