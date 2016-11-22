import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    selector: 'navBar',
    templateUrl: './views/navigation-component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./css/navigation-component.css']
})

export class NavigationComponent {

    public isTodoActive: boolean = true;
    public isCompletedActive: boolean;
    public isNotesActive: boolean;
    public isTimelineActive: boolean;
    public isSettingsActive: boolean;

    public toggleActive(variable: string): void {

        switch(variable){
            case 'isTodoActive': {

                this.isTodoActive = true;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isCompletedActive' :{

                this.isTodoActive = false;
                this.isCompletedActive = true;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isNotesActive':{

                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = true;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isTimelineActive':{

                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = true;
                this.isSettingsActive = false;
                break;
            }
            case 'isSettingsActive':{

                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = true;
                break;
            }
        }
    }
}
