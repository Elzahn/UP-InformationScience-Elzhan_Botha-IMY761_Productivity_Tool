import {Component, ChangeDetectorRef} from '@angular/core';
import {ShowCompletedTodosPipe} from '../pipes/show-todos-pipe';
import {todoType} from './todo';
import {MainComponent} from './main-component';
import {TOOLTIP_DIRECTIVES} from 'ng2-tooltip';

@Component({
    selector: 'completedComponent',
    templateUrl: './views/completed-component.html',
    styleUrls: ['./css/completed-component.css', './css/common.css'],
    directives: [TOOLTIP_DIRECTIVES],
    pipes: [ShowCompletedTodosPipe]
})

export class CompletedComponent extends MainComponent{

    constructor(ref:ChangeDetectorRef) {

        super(ref);
    }

    protected toggleTodoCompletionState(todo:todoType):void {

        todo.completed = false;
        todo.workingOnTodo = false;

        this.deleteTodo(todo, true);
        this.todos.push(todo);
        this.updateMyDaysArray(todo.name, 'completed', todo.completed);

        this.calculateProgressBar();
        this.saveData();
    }

    private updateMyDaysArray(todoName: string, property:string, value:string|boolean): void {

        this.myDays.forEach(function(currentDay){
            currentDay.todos.forEach(function(currentTodo){
                if(currentTodo.name === todoName){
                    currentTodo[property] = value;
                }
            });
        });

        this.saveData();
    }
}