import pandas as pd
import sys

p2p = pd.read_csv(sys.stdin)
print(p2p.to_json(orient='records'))
