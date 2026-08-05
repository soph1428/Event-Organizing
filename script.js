var createEvent = document.getElementById(`createEvent`)
var editEvent = document.getElementById(`editEvent`)
var eventOptions = document.getElementById(`eventOptions`)
var eventDropdown = document.getElementById(`editEventOptions`).querySelector(`select`)
var createEventOptions = document.getElementById(`createEventOptions`)
var deleteEvent = document.getElementById(`deleteEvent`)
var confirmDelete = document.getElementById(`delete`)
var deleteEventDropdown = document.getElementById(`deleteEventOptions`).querySelector(`select`)
var submitEvent = document.getElementById(`submitEvent`)
var viewEvents = document.getElementById(`viewEvents`)
var eventsList = document.getElementById(`events`)
var startDate = document.getElementById(`startDate`)
var endDate = document.getElementById(`endDate`)
var eventLocation = document.getElementById(`eventLocation`)
var title = document.getElementById(`title`)
var events = localStorage.getItem(`events`) ? JSON.parse(localStorage.getItem(`events`)) : []
function updateLocalStorage() {
    localStorage.setItem(`events`, JSON.stringify(events))
} updateLocalStorage()
function changeButtonOptionsVisibility(buttonId, visibility, id) {
    document.getElementById(id || `${buttonId}Options`).hidden = !visibility
    if (!eventDropdown.parentElement.hidden || !deleteEventDropdown.parentElement.hidden) updateEvents()
    updateLocalStorage()
} for (var elem of document.body.querySelectorAll(`*`)) {
    elem.style.fontSize = `30px`
    elem.style.textAlign = `center`
    if (elem.id == `cancel`) {
        elem.onclick = function() {
            changeButtonOptionsVisibility(this.parentElement.id.replace(`Options`, ``), false)
        }
    }
} createEvent.onclick = function() {
    changeButtonOptionsVisibility(createEvent.id, true)
}; startDate.onselectionchange = function() {
}; function updateEvents() { var certainEventDropdown
    if (!eventDropdown.parentElement.hidden) certainEventDropdown = eventDropdown
    if (!confirmDelete.parentElement.hidden) certainEventDropdown = deleteEventDropdown
    certainEventDropdown.innerHTML = ``
    for (var event of events) {
        var eventOption = document.createElement(`option`)
        eventOption.textContent = event.title
        certainEventDropdown.appendChild(eventOption)
    }
} editEvent.onclick = function() {
    changeButtonOptionsVisibility(editEvent.id, true)
    editEventShow()
}; function checkValidEvent(titleElemValue, startDateElemValue, endDateElemValue, editingEventTitle) {
    if (titleElemValue.replace(` `, ``) == ``) return alert(`Title cannot be empty.`)
    else if (events.find(event => event.title == titleElemValue && event.title != editingEventTitle)) return alert(`Another event already has that title.`)
    else if (startDateElemValue.replace(` `, ``) == ``) return alert(`Start date cannot be empty.`)
    else if (endDateElemValue.replace(` `, ``) == ``) return alert(`End date cannot be empty.`)
    else if (startDateElemValue >= endDateElemValue) return alert(`Start date cannot be after or at the same time as the end date.`)
    else return `valid`
} submitEvent.onclick = function() {
    if (checkValidEvent(title.value, startDate.value, endDate.value) != `valid`) {
        return
    } events.push({title: title.value, startDate: startDate.value, endDate: endDate.value, eventLocation: eventLocation.value})
    changeButtonOptionsVisibility(createEvent.id, false)
}; function editEventShow() {
    eventOptions.hidden = false
    eventOptions.innerHTML = `` 
    var eventChosen = events.find(event => event.title == eventDropdown.value)
    if (eventChosen) {
        for (var child of createEventOptions.children) {
            var elem = child.cloneNode(true)
            if (elem.id == `startDate`) elem.id = `startDateEventOption`, elem.value = eventChosen.startDate
            if (elem.id == `endDate`) elem.id = `endDateEventOption`, elem.value = eventChosen.endDate
            if (elem.id == `eventLocation`) elem.id = `eventLocationEventOption`, elem.value = eventChosen.eventLocation
            if (elem.id == `title`) elem.id = `titleEventOption`, elem.value = eventDropdown.value
            if (elem.id == `submitEvent`) {
                elem.textContent = `Update`
                elem.onclick = function() {
                    if (checkValidEvent(document.getElementById(`titleEventOption`).value, document.getElementById(`startDateEventOption`).value, document.getElementById(`endDateEventOption`).value, eventChosen.title) != `valid`) {
                        return
                    } events.find(e => e == eventChosen).title = eventDropdown.value
                    events.find(e => e == eventChosen).startDate = document.getElementById(`startDateEventOption`).value
                    events.find(e => e == eventChosen).endDate = document.getElementById(`endDateEventOption`).value
                    events.find(e => e == eventChosen).eventLocation = document.getElementById(`eventLocationEventOption`).value
                    events.find(e => e == eventChosen).title = document.getElementById(`titleEventOption`).value
                    changeButtonOptionsVisibility(`editEvent`, false)
                }
            } if (elem.id != `cancel`) eventOptions.append(elem)
        }
    }
} eventDropdown.onchange = editEventShow
viewEvents.onclick = function() {
    changeButtonOptionsVisibility(``, viewEvents.textContent.includes(`View`) ? true : false, `events`)
    eventsList.innerHTML = ``
    viewEvents.textContent = `${viewEvents.textContent.includes(`View`) ? `Hide` : `View`} Events`
    if (viewEvents.textContent.includes(`View`)) return
    var eventDates = new Set(events.map(event => new Date(event.startDate).toDateString()))
    if (events.length != 0) {
        for (var eventDate of eventDates) {
            var eventDiv = document.createElement(`div`)
            var dateLabel = document.createElement(`label`)
            dateLabel.textContent = `${new Date(eventDate).toDateString()}`
            eventDiv.append(dateLabel, document.createElement(`br`))
            for (var event of events.filter(event => new Date(event.startDate).toDateString() == new Date(eventDate).toDateString())) {
                var titleLabel = document.createElement(`label`)
                titleLabel.textContent = event.title
                eventDiv.append(titleLabel, document.createElement(`br`))
                var timeLabel = document.createElement(`label`)
                timeLabel.textContent = `From ${new Date(event.startDate).toLocaleTimeString()} to ${new Date(event.endDate).toLocaleTimeString()}`
                eventDiv.append(timeLabel, document.createElement(`br`))
                if (event.eventLocation.replace(` `, ``) != ``) {
                    var eventLocationLabel = document.createElement(`label`)
                    eventLocationLabel.textContent = `Located at: ${event.eventLocation}`
                    eventDiv.append(eventLocationLabel, document.createElement(`br`), document.createElement(`br`))
                }
            } eventsList.append(eventDiv)
        }
    }
}; deleteEvent.onclick = function() {
    changeButtonOptionsVisibility(`deleteEvent`, true)
}; confirmDelete.onclick = function() {
    events.splice(events.indexOf(events.find(e => e.title == deleteEventDropdown.value)), 1)
    changeButtonOptionsVisibility(`deleteEvent`, false)
}