window.addEventListener("load", init);

function init (){
    document.getElementById("impfTyp").addEventListener("click",auswahl);

    // Überprüfung der EIngabe Felder darauf ob alle gefüllt sind und der Termin gespeichert werden kann

    document.getElementById("iDatum").addEventListener("change",impfungSpeichern);
    document.getElementById("iChargenNr").addEventListener("change",impfungSpeichern);
    document.getElementById("iArzt").addEventListener("change",impfungSpeichern);
    document.getElementById("impfstoff").addEventListener("change",impfungSpeichern);
    document.getElementById("schieberegler").addEventListener("click",impfungSpeichern);
    document.getElementById("iSpeichern").addEventListener("click",speicherImpfung);
}

function auswahl (){
    if(document.getElementById("einfachImpfung").checked){
        document.getElementById("dropdown").style.display = "block";
        document.getElementById("schieberegler").style.display = "none";
    }
    else{
        document.getElementById("schieberegler").style.display = "block";
        document.getElementById("dropdown").style.display = "none";
    }
}

function impfungSpeichern(){
    let treffer = false;
    multiImpfung = [];
    if(document.getElementById("multiImpfung").checked){
        
        let schiebereglerElement = document.getElementById("schieberegler");
        let schiebereglerKinder = schiebereglerElement.getElementsByTagName("input");

        for(let i = 0;i<schiebereglerKinder.length;i++){
            if(schiebereglerKinder[i].checked){
                treffer = true;
                multiImpfung.push(schiebereglerKinder[i].id)
            }
        }
    }
    if(document.getElementById("iDatum").value != "" && 
    document.getElementById("iChargenNr").value != "" &&
    document.getElementById("iArzt").value != "" &&
    document.getElementById("impfstoff").value != "" &&

    (document.getElementById("einfachImpfung").checked || 
      treffer
    )

    ){
        document.getElementById("iSpeichern").disabled = false;
    }
    else{
        document.getElementById("iSpeichern").disabled = true;
    }
}

function speicherImpfung(){
    let impfDatum = new Date(document.getElementById("iDatum").value);
    impfDatum.toISOString();
    let impfCharge = document.getElementById("iChargenNr").value;
    let impfstoff = document.getElementById("impfstoff").value;
    let impfArzt = document.getElementById("iArzt").value;
    if(document.getElementById("einfachImpfung").checked){
        let impfArt = document.getElementById("iArt").options[document.getElementById("iArt").selectedIndex].value;
        console.log(impfArt);
        impfpass[impfArt].datum.push(impfDatum);
        impfpass[impfArt].charge.push(impfCharge);
        impfpass[impfArt].impfstoff.push(impfstoff);
        impfpass[impfArt].arzt.push(impfArzt);
        console.log(impfpass);
    }else if(document.getElementById("multiImpfung").checked){
        for(let element of multiImpfung){
            impfpass[element].datum.push(impfDatum);
            impfpass[element].charge.push(impfCharge);
            impfpass[element].impfstoff.push(impfstoff);
            impfpass[element].arzt.push(impfArzt);    
        }
        console.log(impfpass);
    }else{
        console.log("Fehler")
    }
    //impfpass[document.getElementById("impfTyp")]    
}