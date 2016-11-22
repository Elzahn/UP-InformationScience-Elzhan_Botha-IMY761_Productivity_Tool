import {Injectable} from "@angular/core";

export interface noteType {
    description: string;
    completed: boolean;
    inEdit: boolean;
    saved: boolean;
}

@Injectable()
export class NewNote {
    public description: string;
    public completed: boolean;
    public inEdit: boolean;
    public saved: boolean;

    constructor(){
        this.description = "";
        this.completed = false;
        this.inEdit = true;
        this.saved = false;
    };
}
