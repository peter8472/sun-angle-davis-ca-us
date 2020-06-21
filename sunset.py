import os
import sqlite3
import glob
import random
import datetime
import loadsolar
'''
From the documentation of HORIZONS:
BACKGROUND DESCRIPTION
Rise and set elevations are taken to be the maximum of 0 or the input elevation 
cut-off value [0-90 deg], set in the "change defaults" prompt section. Thus, 
if there are local hills, one could set the cut-off at 10 degrees and get RTS 
relative to that elevation.

At low elevations, these rise/set times should be viewed as approximations, 
realistically good to perhaps only 1-2 minutes at the horizon due to local atmospheric 
variation and topography.

To speed RTS-only searches, use the largest step-size compatible with the required accuracy. 
For example, considering the inherent atmospheric instability at the horizon, one should rarely
 need to identify rise/set to better than 5 minute accuracy. Setting a search-step of 5 
 minutes will then produce a table 5 times faster than 1 minute searching.
'''
    

                
if __name__ == "__main__":
    m = loadsolar.SunDatabase()
    for i in m.twilight(ago_time=9033, to_time=12600):
        print(datetime.datetime.fromtimestamp(i[0]), i[1], i[3])
    m.getnow()