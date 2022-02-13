// This stuff looks so bad because it is from my 
// mapstops React project
var mydb;
// var request = indexedDB.open("sunangles");

const SUNSTORE = "sunangles"
const DBNAME = "blah1";
const NOWBUTTON = "now";
const DELETEBUTTON = "deleteall";
const LOADBUTTON = "loadall";

function mylog(message) {
    console.log(message)
}

function startUp() {
    mylog("startup called")
    var mydbreq = window.indexedDB.open(DBNAME, 1)
    mydbreq.onerror = function(event) {
        mylog("error opening databsae")
    }
    mydbreq.onsuccess = function(event) {
        mylog("success opening dartabase");
        mydb = mydbreq.result;
    }
    mydbreq.onupgradeneeded = function(event) {
        mydb = event.target.result;
        mydb.onerror = function(event) {
            mylog("error loading database ")
        }
        mydb.onsuccess = function(event) {
            mylog("done upgrading database")
        }
        switch (event.oldVersion) {
        case 0:
        
            objectStore = mydb.createObjectStore(SUNSTORE, {
                autoIncrement: true
            });

            objectStore.createIndex("date", "date", {
                unique: false
            });
            objectStore.createIndex("sky", "sky", {
                unique: false
            });
            objectStore.createIndex("azimuth", "azimuth", {
                unique: false
            });
            objectStore.createIndex("elevation", "elevation", {
                unique: false
            });
        }
    }
}

function addPoints(pointList) {
    if (mydb) {
        var transaction = mydb.transaction([SUNSTORE], "readwrite");
        transaction.oncomplete = function(event) {
            //console.log("all done");
        }
        ;
        transaction.onerror = function(event) {
            alert("error" + event);
        }
        ;
        var ostore = transaction.objectStore(SUNSTORE);
        for (let point of pointList) {
            var req = ostore.add(point);
        }
        req.onsuccess = function(event) {// console.log("add object success");
        }
        ;
        req.onerror = function(event) {
            alert("add object failuer");
        }
        ;
    } else {
        console.log("no database")
    }
}

function getData(url) {
    /* global fetch */
    fetch(url).then((response)=>{

        return response.text()
    }
    ).then((buffer)=>{

        var stringRay = buffer.split("\r\n")
        buffer = "";
        var addrlist = [];
        if (stringRay[stringRay.length - 1] === '') {

            console.log("LAST ENTERY IS NULL")
            stringRay.pop();

        }
        /* break up the database tranactions into groups
            of 100.  This is to balance the cost of large 
            transactions against the cost of too many
            
            */
        const SLICESIZE = 100;
        const MAXENTRY = 1000000;
        const DONTUSE = stringRay.length - MAXENTRY;
        while (stringRay.length > (DONTUSE > 0 ? DONTUSE : 0)) {
            var tmpray = stringRay.splice(0, SLICESIZE);
            if (tmpray.length > 0)
                addPoints(tmpray.map(function(line) {
                    blah = new Object();
                    blah.sky = ""
                    parts = line.split(/[\t ]+/);

                    time = parts.shift()
                    if (parts.length == 3) {
                        blah.sky = parts.shift()
                    }
                    blah.azimuth = parts.shift()
                    blah.elevation = parts.shift()
                    blah.date = new Date(time * 1000);
                    return blah;
                }));
        }
        console.log("finished loading")
    }
    );
}

startUp();
var fmthours = function(when) {
    hours = when.getHours();
    minutes = when.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (hours < 10) {
        hours = `0${hours}`
    }
    outstring = `${hours}:${minutes}`
    return outstring;
}
var hms = function(when) {
    hours = when.getHours();
    minutes = when.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (hours < 10) {
        hours = `0${hours}`
    }
    secs = when.getSeconds();
    if (secs < 10) {
        secs = `0${secs}`
    }
    outstring = `${hours}:${minutes}:${secs}`
    return outstring;
}
function fixyear(realdate) {
    /* This corrects the year to be between Nov 5, 2019, to Nov 4, 2020 */
    year = realdate.getFullYear();
    month = realdate.getMonth();
    day = realdate.getDate();
    hours = realdate.getHours();
    minutes = realdate.getMinutes();
    seconds = realdate.getSeconds();
    millis = realdate.getMilliseconds();
    if ((month > 9) && (day > 5)) {
        year = 2019;
        
    } else {
        year = 2020;
    }
    return new Date(year,month,day,hours,minutes,seconds,millis);


}



function update(event) {
    var output = document.getElementById("output");
    var timePoint = [];
    while (output.hasChildNodes()) {
        output.removeChild(output.firstChild);
        // memory leak
    }
    chooser = document.getElementById("chooser");
    if (!chooser) {
        alert(chooser)
    }

    current = new Date(chooser.value);
    if (event.target.id == "now") {
        // force time to now
        var pretmp = new Date();
        var tmp = fixyear(pretmp);
        var diff = tmp.getTimezoneOffset() * 60 * 1000;

        isoAdjustHack = new Date(tmp.valueOf() - diff);

        isoAdjustHack.toISOString().slice(0, -1);
        chooser.value = isoAdjustHack.toISOString().slice(0, -1);
        //console.log(`crrected ${current}`)

    }
    before = new Date(current.valueOf() - 1000 * 60 * 60);
    after = new Date(current.valueOf() + 1000 * 60 * 60);
    var boundKeyRange = IDBKeyRange.bound(before, after);
    mystore = mydb.transaction([SUNSTORE]).objectStore(SUNSTORE);
    var index = mystore.index("date");
    index.openCursor(boundKeyRange).onsuccess = (event) => {
        var cursor = event.target.result;
        if (cursor) {

            timePoint.push(cursor.value);
            cursor.continue()
        } else {

            for (i = 0; i < timePoint.length ; i++) {
                var stop = document.createElement("sun-element", {
                    "is": "sun-element"
                });

                stop.setAttribute("date", fmthours(timePoint[i].date));
                stop.setAttribute("sky", timePoint[i].sky);
                stop.setAttribute("azimuth", timePoint[i].azimuth);
                stop.setAttribute("elevation", timePoint[i].elevation);
                output.appendChild(stop);

            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    button = document.getElementById(NOWBUTTON);
    button.addEventListener("click", update);

    document.getElementById(LOADBUTTON).addEventListener("click", function(event) {
        event.target.disabled = true;
        alert("load button");
        getData("sun.txt");
        event.target.disabled = false;
    });
    document.getElementById(DELETEBUTTON).addEventListener("click", function(event) {
        alert("deleleload button");
        window.indexedDB.deleteDatabase(DBNAME);
    });
    document.getElementById("chooser").addEventListener("change", update)
    document.getElementById("live").addEventListener("click", function(event) {
        liveUpdate();
        
    });

});