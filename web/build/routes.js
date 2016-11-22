"use strict";
var router_1 = require('@angular/router');
var todos_component_1 = require('./components/todos-component');
var completed_component_1 = require('./components/completed-component');
var notes_component_1 = require('./components/notes-component');
var settings_component_1 = require('./components/settings-component');
var timeline_component_1 = require('./components/timeline-component');
var routes = [
    {
        path: '',
        component: todos_component_1.TodosComponent
    },
    {
        path: 'todos',
        component: todos_component_1.TodosComponent
    },
    {
        path: 'completed',
        component: completed_component_1.CompletedComponent
    },
    {
        path: 'notes',
        component: notes_component_1.NotesComponent
    },
    {
        path: 'timeline',
        component: timeline_component_1.TimelineComponent
    },
    {
        path: 'settings',
        component: settings_component_1.SettingsComponent
    }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=routes.js.map