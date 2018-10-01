import ReactDOM from 'react-dom'
import React from 'react'

function renderApp() {
    const Application = require('./Application').default
    ReactDOM.render(<Application />, document.getElementById('app'))
}

renderApp()

if (module.hot) {
    module.hot.accept(renderApp)
}



gantt.templates.tooltip_text = function (start, end, task) {
    //console.log("Task in index js: ", task)
    return "<b>Task:</b> " + task.text +
        "<br/><b>Duration:</b> " + task.duration +
        "<br/><b>Startdatum:</b> " + task.start_string +
        "<br/><b>Abteilung:</b> " + task.abteilung +
        "<br/><b>Verantwortlich:</b> " + task.responsible
        ;
};

gantt.config.columns =
    [{ name: "text", label: "Task name", width: "*", tree: true },
    { name: "start_date", label: "Start time", align: "center" },
    { name: "duration", label: "Duration", align: "center" },
];

//gantt.config.readonly = true;
