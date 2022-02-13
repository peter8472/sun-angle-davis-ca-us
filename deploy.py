import subprocess

from config import conn_str
js="az.cmd storage blob  upload-batch -d $web --pattern *.js --source . --connection-string {}".format(conn_str).split()
html="az.cmd storage blob upload-batch -d $web --pattern *.html --source . --connection-string {} ".format(conn_str).split()


subprocess.run(js)
subprocess.run(html)

# for future reference
