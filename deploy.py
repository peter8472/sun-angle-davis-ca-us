import subprocess

js="az.cmd storage blob  upload-batch -d $web --pattern *.js --source .".split()
html="az.cmd storage blob  upload-batch -d $web --pattern *.html --source .".split()

subprocess.run(js)
subprocess.run(html)

