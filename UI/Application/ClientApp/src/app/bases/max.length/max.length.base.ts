import { MAX_LENGTH_EMAIL } from "../../consts/max.length.email";
import { MAX_LENGTH_PASSWORD } from "../../consts/max.length.password";

export class MaxLengthBase {

    readonly maxLengthEmail = MAX_LENGTH_EMAIL;
    readonly maxLengthPassword = MAX_LENGTH_PASSWORD;

    constructor() { }
}