window.addEventListener("load", init);

//var heute = new Date()
//var unterschiedZeit = heute.getTimezoneOffset() / 60 *-1 

function init() {
    //speicherButton()
    termine = [];
    ausstehendeImpfungen =[];
    arzt = new Object();

    if (window.localStorage !== null) {
        holeLocalStorage();
    }

    document.getElementById("terminAnlegenButton").addEventListener("click",erstelleModal);
    document.getElementById("bearbeiten").addEventListener("click", holeLocalStorage);

    
    zeichneTermine();
    abgeschlossenAuslesen();

}
//Arzt voreinstellen
function erstelleModal(){
    //Hier werden die Arzt-Daten aus dem Profil gezogen
    if (Object.keys(arzt) == ""){
        let arztName = document.getElementById("terminArzt");
        arztName.setAttribute("placeholder","Dr. Drosten")    
    }else{
        let arztName = document.getElementById("terminArzt");
        arztName.setAttribute("value",arzt.hausarzt);

        let telefon = document.getElementById("kontaktArzt");
        telefon.innerHTML = "";
        let li = document.createElement("li");
        li.classList.add("list-inline-item");
        telefon.appendChild(li);
        li.innerHTML = "Telefonnummer des Arzts/der Ärztin: ";
        li = document.createElement("li");
        telefon.appendChild(li);
        li.classList.add("list-inline-item");
        let strong = document.createElement("strong");
        li.appendChild(strong);
        strong.innerHTML = arzt.hausarztTelefonnummer;     
    }
    //Hier wird ein spezifischer Button für die Manuelle Terminerstellung erstellt, da auf das Modal auch noch bei Termin buchen verwendet wird
    /*let footer = document.getElementById("terminFooter");
    footer.innerHTML ="";
    let button = document.createElement("button");
    button.setAttribute("type","button");
    button.classList.add("btn");
    button.classList.add("btn-secondary");
    button.setAttribute("data-bs-dismiss","modal");
    footer.appendChild(button);
    button.innerHTML ="Schließen"

    button = document.createElement("button");
    button.setAttribute("type","button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.id = "terminAnlegen";
    button.setAttribute("data-bs-dismiss","modal");
    footer.appendChild(button);
    button.innerHTML ="Termin anlegen"*/

    document.getElementById("terminAnlegen").addEventListener("click", speicherButton);

}

//      ------------ Termine anlegen ---------------
function speicherButton() {
    var termin = new Object();


    termin.datum = document.getElementById("terminDatum").value; console.log(document.getElementById("terminDatum").value);
    termin.art = document.getElementById("terminArt").value; console.log(document.getElementById("terminArt").value);
    termin.arzt = document.getElementById("terminArzt").value; console.log(document.getElementById("terminArzt").value);


    termine.push(termin); console.log(termine[0].arzt);

    zeichneTermine();

    speichereTermine();

    document.getElementById("terminAnlegen").removeEventListener("click",speicherButton);
}

function zeichneTermine() {
    loescheTerminTabelle();

    let table = document.getElementById("terminDaten");
    if (termine == "") {
        let tr = document.createElement("tr");
        tr.classList.add("d-flex");
        table.appendChild(tr);

        let terminDatum = document.createElement("td");
        terminDatum.classList.add("col-12");
        tr.appendChild(terminDatum);
        terminDatum.innerHTML = "Keine Termine";
    }else{

        for (let termin of termine) {
            let tr = document.createElement("tr");
            tr.classList.add("d-flex");
            table.appendChild(tr);

            let terminDatum = document.createElement("td");
            terminDatum.classList.add("col-3");
            tr.appendChild(terminDatum);
            let terminDatumString = new Date(termin.datum)
            terminDatum.innerHTML = terminDatumString.toLocaleDateString('de-DE');

            let terminArt = document.createElement("td");
            terminArt.classList.add("col-3");
            tr.appendChild(terminArt);
            terminArt.innerHTML = termin.art;

            let terminAusstehend = document.createElement("td");
            terminAusstehend.classList.add("col-3");
            tr.appendChild(terminAusstehend);
            terminAusstehend.innerHTML = "---";

            let terminArzt = document.createElement("td");
            terminArzt.classList.add("col-3");
            tr.appendChild(terminArzt);
            terminArzt.innerHTML = termin.arzt;
        }
    }
}

function loescheTerminTabelle() {
    let table = document.getElementById("terminDaten");
    table.innerHTML = "";
}

function loescheAusstehendTabelle() {
    let table = document.getElementById("ausstehendDaten");
    table.innerHTML = "";
}
//TODO Auslesen nach Profilbearbeitung
//! Hier muss das StorageKey mit .... (z.B. ausstehend) wieder geändert werden, wenn der Impfpass implementiert wird
//! Namens-Konvention beachten!
function holeLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let storageKey = localStorage.key(i);
        if(storageKey.slice(0,6) == "termin")
            termine.push(JSON.parse(window.localStorage.getItem(storageKey)));
        /*if(storageKey.slice(0,10) == "ausstehend")
            ausstehendeImpfungen.push(JSON.parse(window.localStorage.getItem(storageKey)));*/
        if(storageKey.slice(0,4) =="Arzt")
            arzt = JSON.parse(window.localStorage.getItem(storageKey)); 
    }
}

function speichereTermine() {
    let key = "termin" + (termine.length);
    let value = JSON.stringify(termine[termine.length - 1]);
    console.log(key + " :" + value);
    window.localStorage.setItem(key, value);
}

// ---------- Ausstehend Berechnen ----------
function abgeschlossenAuslesen(){
    //TODO Es muss bei der dynamischen Erstellung der Abgeschlossen-Beiträge der Name "abgeschlossenEintrag" hinzugefügt werden
    let abgeschlossen = document.getElementsByName("abgeschlossenEintrag")
    for(let part of abgeschlossen){
        var ausstehend = new Object();
        //TODO Das wird nachher aus dem Impfpass-JSON-Objekt herausgelesen, nicht aus der Tabellenzeile
        ausstehend.datum = part.childNodes[1].textContent;
        ausstehend.art = part.childNodes[3].textContent;
        ausstehend.charge = part.childNodes[5].textContent;
        ausstehend.arzt = part.childNodes[7].textContent;

        let datumHeute = new Date()
        console.log(ausstehend.datum)
        let teileImpfdatum = parseDate(ausstehend.datum)
        datumHeute = new Date(datumHeute)
        let datumImpfung = new Date(teileImpfdatum[2], teileImpfdatum[1]-1, teileImpfdatum[0]);

        console.log(datumHeute);
        console.log(datumImpfung)
  
        //datumImpfung = new Date(datumImpfung)
        //let datumnaechsteImpfung = new Date((datum))

        let zeitDifferenz = datumHeute - datumImpfung;
        console.log(zeitDifferenz)
        let minuten = zeitDifferenz / 1000 / 60
        let stunden = minuten / 60
        let tage = stunden / 24
        let jahre = tage / 365

        console.log(tage)
        console.log(jahre)
        // HIER erfolgt die Zeitberechnung der Wiederholung von Impfugen nach einem bestimmten Zeitraum
        // Bei dem verschiedenen Impfungen muss das Jahr als Zeitabstand zwischen den Impfungen angepasst werden!
        switch(ausstehend.art.trim()){
            case "Grippe":
                if(jahre >= 1){
                    ausstehend.naechsteImpfung = new Date(parseInt(teileImpfdatum[2])+1, teileImpfdatum[1]-1, teileImpfdatum[0]).toLocaleDateString('de-DE');
                    console.log("Nächste Impfung: " + ausstehend.naechsteImpfung)
                    console.log(ausstehend)
                    ausstehendeImpfungen.push(ausstehend);
                }
                break;
            case "Kombi":
                if(jahre >= 10){
                    ausstehend.naechsteImpfung = new Date(parseInt(teileImpfdatum[2])+10, teileImpfdatum[1]-1, teileImpfdatum[0]).toLocaleDateString('de-DE');
                    console.log(ausstehend)
                    ausstehendeImpfungen.push(ausstehend);
                }
                break;
        }
    }
    speichereAusstehend();
}

//TODO Diese Methode kann gelöscht werden, wenn die Daten aus dem Impfpass genommen werden

function speichereAusstehend(){
    let zaehlerAusstehend = 0;
    for(let ausstehend of ausstehendeImpfungen){
        let key = "ausstehend" + zaehlerAusstehend;
        let value = JSON.stringify(ausstehendeImpfungen[zaehlerAusstehend]);
        console.log(key + " :" + value);
        window.localStorage.setItem(key, value);
        zaehlerAusstehend = zaehlerAusstehend + 1;    
    }
    zeichneAusstehend();
}

function zeichneAusstehend(){
    loescheAusstehendTabelle();

    let table = document.getElementById("ausstehendDaten");
    if (ausstehendeImpfungen == "") {
        let tr = document.createElement("tr");
        tr.classList.add("d-flex");
        table.appendChild(tr);

        let ausstehendDatum = document.createElement("td");
        ausstehendDatum.classList.add("col-12");
        tr.appendChild(ausstehendDatum);
        terminDatum.innerHTML = "Keine ausstehenden Impfungen";
    }else{

        for (let ausstehend of ausstehendeImpfungen) {
            let tr = document.createElement("tr");
            tr.classList.add("d-flex");
            tr.setAttribute("name","ausstehendeEintraege")
            table.appendChild(tr);

            let ausstehendDatum = document.createElement("td");
            ausstehendDatum.classList.add("col-3");
            tr.appendChild(ausstehendDatum);
            ausstehendDatum.innerHTML = ausstehend.naechsteImpfung;

            let ausstehendArt = document.createElement("td");
            ausstehendArt.classList.add("col-3");
            tr.appendChild(ausstehendArt);
            ausstehendArt.innerHTML = ausstehend.art;

            ausstehendDatum = document.createElement("td");
            ausstehendDatum.classList.add("col-3");
            tr.appendChild(ausstehendDatum);
            ausstehendDatum.innerHTML = ausstehend.datum;

            let ausstehendBuchung = document.createElement("td");
            ausstehendBuchung.classList.add("col-3");
            tr.appendChild(ausstehendBuchung);
            let buchenButton = document.createElement("button");
            buchenButton.setAttribute("type","button")
            buchenButton.classList.add("btn");
            buchenButton.classList.add("btn-outline-warning");
            buchenButton.setAttribute("data-bs-toggle","modal");
            buchenButton.setAttribute("data-bs-target","#Termin")
            buchenButton.addEventListener("click",function(event){terminBuchen(event)});
            ausstehendBuchung.appendChild(buchenButton);
            buchenButton.innerHTML = "Termin buchen"
        }
    }    
}

function terminBuchen(event){

    console.log(event.type + ' on ' + event.target.nodeName);
    //Arztdaten für Kontaktaufnahme
    if (Object.keys(arzt) == ""){
        let arztName = document.getElementById("terminArzt");
        arztName.setAttribute("placeholder","Dr. Drosten")    
    }else{
        let arztName = document.getElementById("terminArzt");
        arztName.setAttribute("value",arzt.hausarzt);

        let telefon = document.getElementById("kontaktArzt");
        telefon.innerHTML = "";
        let li = document.createElement("li");
        li.classList.add("list-inline-item");
        telefon.appendChild(li);
        li.innerHTML = "Telefonnummer des Arzts/der Ärztin: ";
        li = document.createElement("li");
        telefon.appendChild(li);
        li.classList.add("list-inline-item");
        let strong = document.createElement("strong");
        li.appendChild(strong);
        strong.innerHTML = arzt.hausarztTelefonnummer;     
    }
    //console.log(event.target.parentElement.parentElement.rowIndex);

    let ausstehend = JSON.parse(localStorage.getItem("ausstehend"+(event.target.parentElement.parentElement.rowIndex -1)));

    let artImpfung = document.getElementById("terminArt");
    artImpfung.setAttribute("value",ausstehend.art);
    artImpfung.disabled = true;
    //TODO HIER WEITER MACHEN MIT löschen der Reihe, des Array-Elements und des localStorage-Eintrags + Abspeichern als neuer Termin
    /*document.getElementById("terminAnlegen").addEventListener("click",function(event){
        speicherButton();
        loescheReihe(event);
    })*/
/*
    console.log(ausstehend);
    termine.push(ausstehend);

    speichereTermine();
    zeichneTermine();*/
    //! Funktion zum löschen der Zeile
    //event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
}

function loescheReihe(event){
    localStorage.removeItem("ausstehend"+(event.target.parentElement.parentElement.rowIndex -1));   

    //ausstehendeImpfungen.splice((event.target.parentElement.parentElement.rowIndex -1),1);


    event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);

}
//Quelle: https://stackoverflow.com/questions/2945113/how-to-create-a-new-date-in-javascript-from-a-non-standard-date-format/2945150
function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    //console.log(parts);
    return parts;
  }
/*
function setzeAktuelleZeit(){

    document.getElementById("terminDatum").value = heute.toISOString().substring(0,10)
    console.log(document.getElementById("terminDatum").value = heute.toISOString().substring(0,10))
    console.log(unterschiedZeit)
} */