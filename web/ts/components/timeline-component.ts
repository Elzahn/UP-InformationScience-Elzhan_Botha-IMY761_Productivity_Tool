import {Component, ChangeDetectorRef} from '@angular/core';
import {MainComponent} from './main-component';
import {todoType} from './todo';

@Component({
    selector: 'timelineComponent',
    templateUrl: './views/timeline-component.html',
    styleUrls: ['./css/timeline-component.css', './css/common.css']
})

export class TimelineComponent extends MainComponent {

    public displayDetails:number;
    public todoName:string;
    public todoDesc:string;
    public todoDue:string;
    public todoCompleted:string;
    public todoCompletionDate:string;

    constructor(ref:ChangeDetectorRef) {

        super(ref);
        this.displayDetails = 0;
    }

    private isInArray(item:any):boolean {

        let itemIsInArray:boolean = false;

        this.todos.forEach(function (todo) {
            if (todo.name === item.name) {
                itemIsInArray = true;
            }
        });

        if (!itemIsInArray) {
            this.completedTodos.forEach(function (todo) {
                if (todo.name === item.name) {
                    itemIsInArray = true;
                }
            });
        }

        return itemIsInArray;
    }

    public showTimelineDetails(todo:todoType) {

        this.displayDetails = 1;

        this.todoName = todo.name;
        this.todoDesc = todo.description;
        this.todoDue = todo.dueDate;
        this.todoCompleted = "";
        this.todoCompletionDate = '';

        if (todo.name !== "Break Over" && todo.name !== "Break Time") {
            if (!this.isInArray(todo)) {
                this.todoCompleted = "deleted was ";
            } else {
                this.todoCompleted = "";
            }

            if (todo.completed === true) {
                this.todoCompleted += "completed";
                this.todoCompletionDate = todo.completedOn;
            } else {
                this.todoCompleted += "active";
            }
        }
}


public
clearTimelineDetails()
{

    this.displayDetails = 0;

    this.todoName = "";
    this.todoDesc = "";
    this.todoDue = "";
    this.todoCompleted = "";
}
}