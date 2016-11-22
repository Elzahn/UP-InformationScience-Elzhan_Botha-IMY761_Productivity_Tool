import {Injectable} from "@angular/core";

export interface todoType {
    name: string;
    description: string;
    dueDate: string;
    completed: boolean;
    workingOnTodo: boolean;
    inEdit: boolean;
    saved: boolean;
    completedOn: string;
    colour: string;
    datePickerDue: string;
}

@Injectable()
export class NewTodo {
    public name: string;
    public description: string;
    public dueDate: string;
    public completed: boolean;
    public workingOnTodo: boolean;
    public inEdit: boolean;
    public saved: boolean;
    public completedOn: string;
    public colour: string;
    public datePickerDue: string;

    constructor(){
        this.name = "";
        this.description = "";
        this.dueDate = "";
        this.completed = false;
        this.workingOnTodo = false;
        this.inEdit = true;
        this.saved = false;
        this.completedOn = "";
        this.colour = this.generateColour();
        this.datePickerDue = "";
    };

    protected generateColour(): string {
        return Math.floor(Math.random()*16777215).toString(16);
    }
}

