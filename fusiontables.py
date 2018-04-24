from absl import flags as gflags
import json
import requests
import sys
import logging

root = logging.getLogger()
root.setLevel(logging.INFO)

FLAGS = gflags.FLAGS
gflags.DEFINE_string('refresh_token', None, 'OAuth 2 Refresh Token')
FLAGS(sys.argv)

TABLE_ID = "1fAeKubYzWae7KT2qYFzku1M6N3c1Gncs1XDgPOc"

# Refresh credentials
res1 = requests.post("https://accounts.google.com/o/oauth2/token", data={
  "client_secret": "Jks0IwL12XgJ5Fl5qKUW0al9",
  "grant_type": "refresh_token",
  # Got this using the Google OAuth Playground
  "refresh_token": FLAGS.refresh_token,
  "client_id": "902170075797-c04c7drkbph8vqb2eqgjsn04euqc64kl.apps.googleusercontent.com"
})
logging.info("Refreshed credentials, %s, %s", res1, res1.content)

access_token = json.loads(res1.content)["access_token"]

logging.info("Removing rows...")
res2 = requests.post("https://www.googleapis.com/fusiontables/v1/query",
    headers={"Authorization": "OAuth " + access_token},
    data={"sql": "DELETE FROM %s{ }" % TABLE_ID})
logging.info("Removed rows. %s, %s", res2, res2.content)

logging.info("Uploading rows...")
res3 = requests.post(
    "https://www.googleapis.com/upload/fusiontables/v1/tables/%s/import" % TABLE_ID,
    headers={
      "Authorization": "OAuth " + access_token,
      "Content-Type": "application/octet-stream"
      },
    data=sys.stdin.read())
logging.info("Updated rows. %s, %s", res3, res3.content)
