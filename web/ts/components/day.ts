import {todoType} from "./todo";

export interface dayType {
    date: string;
    todos: Array<todoType>;
}

export class newDay{

    public date: string;
    public todos: Array<todoType>;

    constructor(date:string, todo?:todoType) {

        let tempTodoArr = new Array<todoType>();
        if(todo)
            tempTodoArr.push(todo);

        this.date = date;
        this.todos = tempTodoArr;
    }
}