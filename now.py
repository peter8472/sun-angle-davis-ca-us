import os
import sqlite3
import glob
import random
import datetime
import loadsolar
    

                
if __name__ == "__main__":
    m = loadsolar.SunDatabase()
    for i in m.getnow(ago_time=0, to_time=12600):
        print(datetime.datetime.fromtimestamp(i[0]), i[1], i[3])