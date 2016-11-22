import {Component, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {NewTodo, todoType} from './todo';
import {ShowActiveTodosPipe, ShowInPeriodPipe} from '../pipes/show-todos-pipe';
import {MainComponent} from "./main-component";
import {TOOLTIP_DIRECTIVES} from 'ng2-tooltip';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';
import {OrderByPipe} from '../pipes/orderBy-pipe';

@Component({
    selector:'activeComponent',
    templateUrl:'./views/todos-component.html',
    styleUrls:['./css/todos-component.css', './css/common.css'],
    providers:[ToasterService, DragulaService],
    directives:[TOOLTIP_DIRECTIVES, ToasterContainerComponent, Dragula],
    pipes:[ShowActiveTodosPipe, OrderByPipe, ShowInPeriodPipe]
})

export class TodosComponent extends MainComponent {

    @ViewChild('Todos') private myScrollContainer: ElementRef;
    
    protected savedArg = {saved:true};
    protected notSavedArg = {saved:false};
    private toasterService:ToasterService;
    private dragulaService:DragulaService;
    public static filteredTodosEmpty:boolean = false;
    public static filteredMessage:string = "";
    public static filteredBy:String = "";

    constructor (ref:ChangeDetectorRef, toasterService:ToasterService, dragulaService:DragulaService) {

        super(ref);
        this.toasterService = toasterService;
        this.dragulaService = dragulaService;

        this.dragulaService.setOptions('todo-container', {
            revertOnSpill:true, moves:function (el, container, handle) {
                return handle.className === 'handle';
            }
        });

        this.dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value.slice(1));
        });
    }

    private onDropModel (args) {
        this.saveData();
    }

    public getFilteredTodosEmpty(){
        return TodosComponent.filteredTodosEmpty;
    }

    public getFilteredMessage(){
        return TodosComponent.filteredMessage;
    }

    public getFilteredBy(){
        return TodosComponent.filteredBy;
    }

    protected addTodo ():void {

        let alreadyOpen:boolean = false;
        this.myScrollContainer.nativeElement.scrollTop = 0;

        if (this.todos && this.todos.length > 0) {
            this.todos.forEach(function (todo) {
                if (!todo.saved)
                    alreadyOpen = true;

                if (todo.saved && todo.inEdit)
                    this.cancelChanges(todo);

            }.bind(this));
        }

        if (!alreadyOpen) {
            this.todos.push(new NewTodo());
            this.calculateProgressBar();
        } else {
            this.toasterService.pop("warning", "Add new todo", "Only one todo can be added at a time.");
        }
    }

    protected workingOnIt (todo:todoType):void {

        todo.workingOnTodo = !todo.workingOnTodo;

        if (todo.workingOnTodo) {
            this.toasterService.pop("success", "Working on it", "Todo added to timeline");
            let date = this.getShortenedDate(new Date());
            this.addDayToArray(date, todo);
        }

        this.saveData();
    }

    protected toggleTodoCompletionState (todo:todoType):void {

        todo.completed = true;
        todo.workingOnTodo = false;

        todo.completedOn = this.getShortenedDate(new Date());
        this.deleteTodo(todo, true);
        this.completedTodos.push(todo);

        this.calculateProgressBar();
        this.updateMyDaysArray(todo.name, 'completed', todo.completed);
        this.saveData();
    }

    protected acceptChanges (todo:todoType, todoName:string, todoDesc:string, todoDueDate:string):void {

        if (todoName !== "" && todoDesc !== "" && todoDueDate != "") {

            let duplicate:boolean = false;

            if (!todo.saved) {
                if (this.todos) {
                    this.todos.forEach(function (todo) {
                        if (todo.name === todoName) {
                            duplicate = true;
                        }
                    });
                }
            }

            if (duplicate) {
                this.toasterService.pop("warning", "Accept changes", "A todo with this name already exists.");
            } else {
                todo.name = todoName;
                todo.description = todoDesc;
                todo.dueDate = this.getShortenedDate(new Date(todoDueDate));
                todo.saved = true;
                todo.inEdit = false;
                todo.datePickerDue = todoDueDate;
                this.toasterService.clear();
                this.saveData();
            }
        } else {
            this.toasterService.pop("warning", "Accept changes", "All fields must be completed before saving changes.");
        }
    }

    protected cancelChanges (todo:todoType):void {

        if (todo.saved) {
            todo.inEdit = false;
        } else {
            this.deleteTodo(todo);
        }
    }

    protected activateEditMode (todo:todoType):void {

        this.todos.forEach(function (currentTodo) {
            if (currentTodo.inEdit)
                this.cancelChanges(currentTodo);
        }.bind(this));

        todo.inEdit = true;

        this.ref.markForCheck();
    }

    private updateMyDaysArray (todoName:string, property:string, value:string|boolean):void {

        this.myDays.forEach(function (currentDay) {
            currentDay.todos.forEach(function (currentTodo) {
                if (currentTodo.name === todoName) {
                    currentTodo[property] = value;
                }
            });
        });

        this.saveData();
    }
}