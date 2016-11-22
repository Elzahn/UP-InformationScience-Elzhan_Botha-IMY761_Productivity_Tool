import {provideRouter, RouterConfig}  from '@angular/router';
import {TodosComponent} from './components/todos-component';
import {CompletedComponent} from './components/completed-component';
import {NotesComponent} from './components/notes-component';
import {SettingsComponent} from './components/settings-component';
import {TimelineComponent} from './components/timeline-component';

const routes:RouterConfig = [
    {
        path: '',
        component: TodosComponent
    },
    {
        path: 'todos',
        component: TodosComponent
    },
    {
        path: 'completed',
        component: CompletedComponent
    },
    {
        path: 'notes',
        component: NotesComponent
    },
    {
        path: 'timeline',
        component: TimelineComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];