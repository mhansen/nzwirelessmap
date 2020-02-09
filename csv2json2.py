import sys
import csv
import json

# Note this writes everything out as a string
json.dump([line for line in csv.DictReader(sys.stdin)], sys.stdout)
