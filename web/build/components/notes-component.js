"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var note_1 = require("./note");
var show_notes_pipe_1 = require('../pipes/show-notes-pipe');
var main_component_1 = require('./main-component');
var ng2_tooltip_1 = require('ng2-tooltip');
var angular2_toaster_1 = require('angular2-toaster/angular2-toaster');
var ng2_dragula_1 = require('ng2-dragula/ng2-dragula');
var NotesComponent = (function (_super) {
    __extends(NotesComponent, _super);
    function NotesComponent(ref, toasterService, dragulaService) {
        var _this = this;
        _super.call(this, ref);
        this.completedNote = { completed: true, saved: true };
        this.activeNote = { completed: false, saved: true };
        this.toasterService = toasterService;
        this.dragulaService = dragulaService;
        this.dragulaService.setOptions('notes-container', {
            revertOnSpill: true,
            moves: function (el, container, handle) {
                return handle.className === 'handle';
            }
        });
        this.dragulaService.dropModel.subscribe(function (value) {
            _this.onDropModel(value.slice(1));
        });
    }
    NotesComponent.prototype.onDropModel = function (args) {
        this.saveData();
    };
    NotesComponent.prototype.addNote = function () {
        var alreadyOpen = false;
        this.myScrollContainer.nativeElement.scrollTop = 0;
        this.notes.forEach(function (note) {
            if (!note.saved)
                alreadyOpen = true;
            if (note.saved && note.inEdit)
                this.cancelChanges(note);
        }.bind(this));
        if (!alreadyOpen) {
            this.notes.push(new note_1.NewNote());
        }
        else {
            this.toasterService.pop("warning", "Add new note", "Only one note can be added at a time.");
        }
    };
    NotesComponent.prototype.activateEditMode = function (note) {
        this.notes.forEach(function (currentNote) {
            if (currentNote.inEdit)
                this.cancelChanges(currentNote);
        }.bind(this));
        note.inEdit = true;
        this.ref.markForCheck();
    };
    NotesComponent.prototype.toggleTodoCompletionState = function (note) {
        note.completed = !note.completed;
        this.deleteNote(note, true);
        if (note.completed) {
            this.completedNotes.push(note);
        }
        else {
            this.notes.push(note);
        }
        this.saveData();
    };
    NotesComponent.prototype.acceptChanges = function (note, noteDescription) {
        if (noteDescription !== "") {
            var duplicate_1 = false;
            if (!note.saved) {
                if (this.notes) {
                    this.notes.forEach(function (note) {
                        if (note.description === noteDescription) {
                            duplicate_1 = true;
                        }
                    });
                }
            }
            if (duplicate_1) {
                this.toasterService.pop("warning", "Accept changes", "A note with this description already exists.");
            }
            else {
                note.description = noteDescription;
                note.completed = false;
                note.saved = true;
                note.inEdit = false;
                this.toasterService.clear();
                this.saveData();
            }
        }
        else {
            this.toasterService.pop("warning", "Accept changes", "All fields must be completed before saving changes.");
        }
    };
    NotesComponent.prototype.cancelChanges = function (note) {
        if (note.saved) {
            note.inEdit = false;
        }
        else {
            this.deleteNote(note);
        }
    };
    NotesComponent.prototype.deleteNote = function (note, completed) {
        var userAction;
        if (completed == undefined && note.description != "") {
            userAction = confirm("Continue with the deletion of note: " + note.description + "?");
        }
        else {
            userAction = true;
        }
        if (userAction) {
            var index = this.notes.indexOf(note);
            if (index > -1) {
                this.notes.splice(index, 1);
                this.saveData();
            }
            else {
                var index_1 = this.completedNotes.indexOf(note);
                if (index_1 > -1) {
                    this.completedNotes.splice(index_1, 1);
                    this.saveData();
                }
            }
        }
    };
    NotesComponent.prototype.notifyUserCantEdit = function () {
        this.toasterService.pop("warning", "Note completed todo", "You can not edit a completed note");
    };
    __decorate([
        core_1.ViewChild('Notes'), 
        __metadata('design:type', core_1.ElementRef)
    ], NotesComponent.prototype, "myScrollContainer", void 0);
    NotesComponent = __decorate([
        core_1.Component({
            selector: 'notesComponent',
            templateUrl: './views/notes-component.html',
            styleUrls: ['./css/notes-component.css', './css/common.css'],
            providers: [angular2_toaster_1.ToasterService, ng2_dragula_1.DragulaService],
            directives: [ng2_tooltip_1.TOOLTIP_DIRECTIVES, angular2_toaster_1.ToasterContainerComponent, ng2_dragula_1.Dragula],
            pipes: [show_notes_pipe_1.ShowNotesPipe, show_notes_pipe_1.ShowNewNotePipe]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, angular2_toaster_1.ToasterService, ng2_dragula_1.DragulaService])
    ], NotesComponent);
    return NotesComponent;
}(main_component_1.MainComponent));
exports.NotesComponent = NotesComponent;
//# sourceMappingURL=notes-component.js.map