import { PlaceLocation } from "./PlaceLocation";
import { TastingRating } from "./TastingRating";


export class Coffee {
    //Properties
    _id?: string;
    type?: string;
    rating?: number;
    notes?:string;
    tastingRating?: TastingRating|null;

    constructor(public name:string='', public place:string='', public location: PlaceLocation = new PlaceLocation()) {
        this.location = new PlaceLocation();
        this.tastingRating = new TastingRating();
    }
}