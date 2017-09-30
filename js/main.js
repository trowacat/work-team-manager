var viewModel = {
    "teams": [],
    "employees": [],
    "projects": []
}

function showGenericModal(title, message) {
    $('.modal-title').html(title)
    $('.modal-body').html(message)

    $('#genericModal').modal()
}

function initializeTeams() {
    return new Promise(function (resolve, reject) {
        $.get('https://tranquil-hollows-40489.herokuapp.com/teams-raw', function (teams) {
            viewModel.teams = ko.mapping.fromJS(teams)
            resolve()
        })
            .fail(function () {
                reject("Error loading the team data")
            })
    })
}

function initializeEmployees() {
    return new Promise(function (resolve, reject) {
        $.get('https://tranquil-hollows-40489.herokuapp.com/employees', function (employees) {
            viewModel.employees = ko.mapping.fromJS(employees)
            resolve()
        })
            .fail(function () {
                reject("Error loading the employee data")
            })
    })
}

function initializeProjects() {
    return new Promise(function (resolve, reject) {
        $.get('https://tranquil-hollows-40489.herokuapp.com/projects', function (projects) {
            viewModel.projects = ko.mapping.fromJS(projects)
            resolve()
        })
            .fail(function () {
                reject("Error loading the project data")
            })
    })
}

function saveTeam() {
    var currentTeam = this,
        toSend = {
            _id: currentTeam._id(),
            Projects: currentTeam.Projects(),
            Employees: currentTeam.Employees(),
            TeamLead: currentTeam.TeamLead()
        }

    $.ajax({
        url: 'https://tranquil-hollows-40489.herokuapp.com/team/' + currentTeam._id(),
        method: 'PUT',
        contentType: 'application/JSON',
        data: JSON.stringify(toSend),
    })
        .done(function () { showGenericModal("Success", currentTeam.TeamName() + " updated succesfully.") })
        .fail(function () { showGenericModal("Error", "Error updating the team information.") })
}

$(function () {
    initializeTeams()
        .then(initializeEmployees)
        .then(initializeProjects)
        .then(function () {
            ko.applyBindings(viewModel, $("body")[0])
            $(".multiple").multipleSelect({ filter: true })
            $(".single").multipleSelect({ single: true, filter: true })
        })
        .catch(function (err) { showGenericModal("Error", err) })
})