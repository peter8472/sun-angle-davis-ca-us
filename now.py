import os
import sqlite3
import glob
import random
import datetime
import loadsolar
    

                
if __name__ == "__main__":
    m = loadsolar.SunDatabase()
    now = datetime.datetime.today().timestamp()
    results = m.nearest(ago_time=2352, to_time=398472, when=now)
    for i in results[0:2]:
 
    
       print(datetime.datetime.fromtimestamp(i[0]), i[1], i[3])
    print (
        datetime.datetime.fromtimestamp(now),
        
        
        loadsolar.interpolate(results[0], results[1], now))
    
    