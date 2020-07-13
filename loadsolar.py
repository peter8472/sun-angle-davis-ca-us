import os
import sqlite3
import glob
import random
import datetime
'https://www.weather.gov/fsd/twilight'
'''
civil twilight: ends when geometric center of sun is 6 degrees below horizon
nautical twilight: ends when geometric center is 12 degrees below horizon
astronomical twilight: ends when geometric center is 18 degrees below horizon
'''

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
        
    

    def getnow(self,ago_time=600,to_time=600):
        'return a range of records relative to the current time'
        now = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where timestamp 
            between {} and {}""".format(now - ago_time, now + to_time))
        return cur.fetchall()

    def nearest(self,ago_time=7600,to_time=6700,when=None):
        'return two closest records  to the current time'
        'or given parameter "when"'
        if when == None:

            when = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where timestamp 
            between {} and {} order by abs(timestamp - {}) limit 25""".format(when - ago_time, when + to_time, when))

        return(cur.fetchall())
    def twilight(self,ago_time=600,to_time=600):
        'return a range of records relative to the current time'
        now = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where elevation between -18 and 5 and timestamp 
            between {} and {}""".format(now - ago_time, now + to_time))

        return(cur.fetchall())
    def sunsets(self, ago_days = 5, to_days=5):
        'get the sunset time for the previous and next days'
        now = datetime.datetime.today().timestamp()
        cur = self.conn.execute("""select * from solar where timestamp 
            between {} and {} and sky like "%s%" """.format(now - ago_days*60*60*24, 
                    now + to_days*60*60*24))

        return  cur.fetchall()
            

def dump_to_file():
    'prints a tsv for all records'
    db = SunDatabase()
    cur = db.conn.execute("select * from solar order by timestamp;")
    for i in cur.fetchall():
        print('{}\t{}\t{}\t{}'.format(i[0],i[1],i[2],i[3]))


        



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
                

# ( timestamp INTEGER, sky STRING, azimuth FLOAT,  elevation FLOAT);
def interpolate(val1, val2, tstamp):
    'interpolate between two timestamps.'
    'calculate the offsets'
    fraction = (tstamp - val1[0])/(val2[0] - val1[0])
    elevationX  =  fraction  * (val2[3] - val1[3]) + val1[3]
    return elevationX

    

def simpleInterpolate(val1, val2, fraction=.5):
    elevationX  =  fraction  * (val2 - val1) + val1
    return elevationX
    


if __name__ == "__main__":
    assert simpleInterpolate(0,100, fraction=.4) == 40
    assert simpleInterpolate(100,0, fraction = .4) == 60
    assert simpleInterpolate(-10,0) == -5
    assert simpleInterpolate(-10,10) == 0
    assert simpleInterpolate(-10,0) == -5
    assert simpleInterpolate(-10,-20) == -15
    assert simpleInterpolate(-30,-20) == -25
    

    

    # db = SunDatabase()
    # cur = db.conn.execute("""select min(elevation),max(elevation) from solar where sky like "A%" 
    #     limit 150""")

    # for i in cur.fetchall():
    #     print(i)
    # db.nearest()


