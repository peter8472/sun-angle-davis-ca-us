
function addPoints(pointList) {
    if (mydb) {
        var transaction = mydb.transaction(["sunangles"], "readwrite");
        transaction.oncomplete = function(event) {//console.log("all done");
        }
        ;
        transaction.onerror = function(event) {
            alert("error" + event);
        }
        ;
        var ostore = transaction.objectStore("addys");
        for (let point of pointList) {
            point['X'] = Number(point['X'])
            point['Y'] = Number(point['Y'])
            var req = ostore.add(point);
        }

        req.onsuccess = function(event) {
            console.log("add object success");
        }
        ;
        req.onerror = function(event) {
            alert("add object failuer");
        }
        ;
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
                    try {
                        parts = line.split(/[\t ]+/);
        day = parts.shift()
        time = parts.shift()
        if (parts.length == 3) {
            sky  = parts.shift()
        }
        azimuth = parts.shift()
        elevation = parts.shift()
        d = parseTime(day,time).timestamp()
        mydb.insert(d, sky,azimuth,elevation)
    mydb.commit()
                    return JSON.parse(instr);
                    } catch (error) {
                        console.log(error);
                        console.log(instr);
                    }





                                    }));
        }

        this.setState({
            isGetting: "parse is done",
            data: addrlist

        });
    }
    );
}
getData("sun.txt")