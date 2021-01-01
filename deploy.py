import subprocess

js="az.cmd storage blob  upload-batch -d $web --pattern *.js --source .".split()
html="az.cmd storage blob  upload-batch -d $web --pattern *.html --source .".split()

subprocess.run(js)
subprocess.run(html)

# for future reference
conn_str = "DefaultEndpointsProtocol=https;AccountName=davissunangle;AccountKey=047TuPNeI5vGhlIgUZsug6uSxFAab6cD/uzipZFBv+CETWJBL5WT1mwSnsOD3F6dP8y0DTndqtQ80z8PM4wP9A==;EndpointSuffix=core.windows.net"