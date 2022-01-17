function refreshLobbies(){
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", yourUrl, true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     value: value
    // }));

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            let lobbyTable = document.getElementById("lobbyTable");
            let lobbyEntryTemplate = document.getElementById("lobbyEntry");
            var data = JSON.parse(this.responseText);
            
            let removeRows = lobbyTable.querySelectorAll("tr");
            for(let i = 1; i < removeRows.length; i++)
                lobbyTable.removeChild(removeRows[i]);

            for(let i = 0; i < data.length; i++)
            {
                let newRow = lobbyEntryTemplate.content.cloneNode(true);
                let columns = newRow.querySelectorAll("td");
                let link = newRow.querySelector("a");
                link.href = window.location + "lobbies/" + data[i].lobbyId;
                link.textContent = data[i].lobbyName;
                // columns[0].textContent = data[i].lobbyName;
                columns[1].textContent = data[i].lobbyId;
                columns[2].textContent = data[i].playerCount;
                lobbyTable.appendChild(newRow);
            }
        }
    };

    xhr.open("GET", "http://" + window.location.host + "/list_lobbies", true);
    xhr.send();
}

function createLobby() {
    let lobbyNameElem = document.getElementById("lobbyNameField");
    let lobbyName = lobbyNameElem.value;
    console.log(lobbyName);
    lobbyNameElem.value = "";

    var xhr = new XMLHttpRequest();
    

    // TODO: When request is finished being processed. Check if the status is 201 or not, and
    // report a success/failure to the user based on this.
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 201) {
            console.log("Lobby creation was successful");
        }
        else {
            console.log("Lobby creation was not successful");
        }

        refreshLobbies();
    };

    xhr.open("POST", "http://" + window.location.host + "/create_lobby", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
        lobbyName
    }));
}