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



gantt.templates.tooltip_text = function(start,end,task){
    return "<b>Task:</b> "+task.text+
    "<br/><b>Duration:</b> " + task.duration+
    "<br/><b>Startdatum:</b> " + task.start_datum+
    "<br/><b>Progress:</b> " + task.progress
    ;
};