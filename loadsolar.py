import os
import sqlite3
import glob
import random
import datetime


class SunDatabase(object):
    def __init__(self):
        self.conn = sqlite3.connect("solarangle.db")
    def rebuild(self):
        self.conn.execute("drop table if exists solar;")
        self.conn.execute("""create table if not exists solar 
                ( timestamp INTEGER, sky STRING, azimuth FLOAT,  elevation FLOAT);""")
    def insert(self,timestamp,sky,azimuth,elevation):
        self.conn.execute("insert into solar values(?,?,?,?);",
            (timestamp,sky,azimuth,elevation)
        
        )
    def commit(self):
        self.conn.commit()
        
    def getnow(self):
        now = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where timestamp 
            between {} and {}""".format(now - 600, now + 600))

        print(cur.fetchall())
    def sunset(self):
        now = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where timestamp 
            between {} and {} and elevation > -5""".format(now - 600, now + 12*60*60))

        for i in cur.fetchall():
            print(
                datetime.datetime.fromtimestamp(i[0]),
                i[1], i[2])

def dump_to_file():
    db = SunDatabase()
    cur = db.conn.execute("select * from solar order by timestamp;")
    for i in range(0,10):

        print (cur.fetchone())



monthTab = {
    "Jan":1,    "Feb":2,    "Mar":3,
    "Apr":4,    "May":5,    "Jun":6,
    "Jul":7,    "Aug":8,    "Sep":9,
    "Oct":10,    "Nov":11,    "Dec":12
}
def parseTime(day,time):
    (year,mname,day) = day.split("-")
    year = int(year)
    day=int(day)
    month = monthTab[mname]
    (hours,minutes) = map(int,time.split(":"))
    seconds = 0
    microseconds=0
    pacific  =  datetime.datetime(year, month,day,hours,minutes,
       seconds,microseconds,datetime.timezone.utc)
    gmt = pacific + datetime.timedelta(hours=8)
    
    return gmt
    
def get_generator_from_horizons_output():
    home = os.getenv("USERPROFILE")
    if home == None:
        home=os.getenv("HOME")
    fn = os.path.join(home, "OneDrive", "solarcalc", "horizons_results (4).txt")
    file = open(fn)
    processing = False
    for line in file:
        if line.startswith("$$SOE"):
            processing = True
            print("start processing")
        elif line.startswith("$$EOE"):
            processing = False
            print("stop processing")
        else:
            if processing == True:
                yield line

def make_a_new_database():
    home = os.getenv("USERPROFILE")
    mydb = SunDatabase()
    mydb.rebuild()
        
    myfile = get_generator_from_horizons_output()
    for line in myfile:
        sky = ""
        
        parts = line.split()
        day = parts.pop(0)
        time = parts.pop(0)
        if len(parts) == 3:
            sky  = parts.pop(0)
        azimuth = parts.pop(0)
        elevation = parts.pop(0)
        d = parseTime(day,time).timestamp()
        mydb.insert(d, sky,azimuth,elevation)
    mydb.commit()
                
if __name__ == "__main__":
    dump_to_file()
