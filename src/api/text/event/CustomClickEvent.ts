import { v4 as uuidv4 } from 'uuid';

export class CustomClickEvent {
    id: string;
    action: Function;

    constructor(action: Function, id: string = uuidv4()) {
        this.id = id;
        this.action = action;
    }
}