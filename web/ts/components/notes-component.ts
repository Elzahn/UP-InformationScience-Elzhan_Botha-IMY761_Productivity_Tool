import {Component, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {noteType, NewNote} from "./note";
import {ShowNotesPipe, ShowNewNotePipe} from '../pipes/show-notes-pipe';
import {MainComponent} from './main-component';
import {TOOLTIP_DIRECTIVES} from 'ng2-tooltip';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'notesComponent',
    templateUrl: './views/notes-component.html',
    styleUrls: ['./css/notes-component.css', './css/common.css'],
    providers: [ToasterService, DragulaService],
    directives: [TOOLTIP_DIRECTIVES, ToasterContainerComponent, Dragula],
    pipes: [ShowNotesPipe, ShowNewNotePipe]
})

export class NotesComponent extends MainComponent{

    @ViewChild('Notes') private myScrollContainer: ElementRef;

    protected completedNote = {completed: true, saved: true};
    protected activeNote = {completed: false, saved: true};
    private toasterService: ToasterService;
    private dragulaService: DragulaService;

    constructor(ref:ChangeDetectorRef, toasterService:ToasterService, dragulaService:DragulaService) {

        super(ref);
        this.toasterService = toasterService;
        this.dragulaService = dragulaService;

        this.dragulaService.setOptions('notes-container', {
            revertOnSpill: true,
            moves:function (el, container, handle) {
                return handle.className === 'handle';
            }
        });

        this.dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value.slice(1));
        });
    }

    private onDropModel(args) {
        this.saveData();
    }

    protected addNote():void {

        let alreadyOpen:boolean = false;
        this.myScrollContainer.nativeElement.scrollTop = 0;

        this.notes.forEach(function (note) {
            if(!note.saved)
                alreadyOpen = true;

            if(note.saved && note.inEdit)
                this.cancelChanges(note);

        }.bind(this));

        if(!alreadyOpen) {
            this.notes.push(new NewNote());
        } else {
            this.toasterService.pop("warning", "Add new note", "Only one note can be added at a time.");
        }
    }

    protected activateEditMode(note:noteType):void {

        this.notes.forEach(function (currentNote) {
            if(currentNote.inEdit)
                this.cancelChanges(currentNote);
        }.bind(this));

        note.inEdit = true;
        this.ref.markForCheck();
    }

    protected toggleTodoCompletionState(note:noteType):void {

        note.completed = !note.completed;
        this.deleteNote(note, true);

        if(note.completed){
            this.completedNotes.push(note);
        } else {
            this.notes.push(note);
        }
        this.saveData();
    }

    protected acceptChanges(note:noteType, noteDescription:string):void {

        if(noteDescription !== "") {
            let duplicate:boolean = false;

            if (!note.saved) {
                if (this.notes) {
                    this.notes.forEach(function (note) {
                        if (note.description === noteDescription) {
                            duplicate = true;
                        }
                    });
                }
            }

            if (duplicate) {
                this.toasterService.pop("warning", "Accept changes", "A note with this description already exists.");
            } else {
                note.description = noteDescription;
                note.completed = false;
                note.saved = true;
                note.inEdit = false;
                this.toasterService.clear();
                this.saveData();
            }
        } else {
            this.toasterService.pop("warning", "Accept changes", "All fields must be completed before saving changes.");
        }
    }

    protected cancelChanges(note:noteType):void {

        if(note.saved) {
            note.inEdit = false;
        } else {
            this.deleteNote(note);
        }
    }

    protected deleteNote(note:noteType, completed?:boolean):void {


        let userAction:boolean;

        if(completed == undefined && note.description != "") {
            userAction = confirm("Continue with the deletion of note: " + note.description + "?");
        } else {
            userAction = true;
        }

        if(userAction) {
            let index = this.notes.indexOf(note);

            if (index > -1) {
                this.notes.splice(index, 1);
                this.saveData();
            } else {
                let index = this.completedNotes.indexOf(note);

                if (index > -1) {
                    this.completedNotes.splice(index, 1);
                    this.saveData();
                }
            }
        }
    }

    public notifyUserCantEdit(){
        this.toasterService.pop("warning", "Note completed todo", "You can not edit a completed note");
    }
}