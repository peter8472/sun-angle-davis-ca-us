function liveUpdate(event) {
    var output = document.getElementById("current");
    var timePoint = [];
    now = new Date();

    
    // force time to now
    var tmp = new Date();
    var diff = tmp.getTimezoneOffset() * 60 * 1000;
    before = new Date(now.valueOf() - 3000 * 60 * 30);
    after = new Date(now.valueOf() + 3000 * 60 * 30);
    var boundKeyRange = IDBKeyRange.bound(before, after);
    mystore = mydb.transaction([SUNSTORE]).objectStore(SUNSTORE);
    var index = mystore.index("date");
    index.openCursor(boundKeyRange).onsuccess = (event)=>{
        var cursor = event.target.result;
        if (cursor) {

            timePoint.push(cursor.value);
            cursor.continue()
        }else {
            
            timePoint.sort(function(a,b) {
                now = new Date();
                return Math.abs(now - a['date']) - Math.abs(now - b['date'])
            })
            // now interpolate between the nearest two,
            // timepoint[0] and timepoint[1]
    

        fraction = Math.abs((now - timePoint[0].date)/(timePoint[0].date-timePoint[1].date))
        //elevationX  =  fraction  * (val2[3] - val1[3]) + val1[3]
        val0 = parseFloat(timePoint[0].elevation);
        val1 = parseFloat(timePoint[1].elevation);
        range = val1 - val0; // negative if setting
        portion = fraction * range;
        
        
        elevationX  =  portion + val1;
        

            
 
            output.setAttribute("date", hms(now));
            output.setAttribute("elevation", elevationX);
            // output.setAttribute("sky", timePoint[i].sky);
            // output.setAttribute("azimuth", timePoint[i].azimuth);
            // output.setAttribute("elevation", timePoint[i].elevation);


        }
    }
}
