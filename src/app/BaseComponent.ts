/**
 * Created by Johnno on 2-6-2017.
 */
export class BaseComponent{

    constructor(){}

    public someMethod(): string{
        return this.getRandomInt(1, 40);
    }

    //and whatever methods and vars
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}