from flask import Flask, render_template
from flask.json import jsonify
import json
import pymongo
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
# d = dict((db, [collection for collection in client[db].collection_names()])
#         for db in client.database_names())

db = client.BrewsForBubbles

mongoCollections = ['states','cities','breweries','style']
appData = []

for mc in mongoCollections:
    collectionForBubbles = db[mc]

    cfBubbles = list(collectionForBubbles.find())
    del cfBubbles[0]['_id']

    appData.append({mc:cfBubbles[0]})

appData = json.dumps(appData, default=json_util.default)

def mapData():
    db = client.DataForMap
    mongoCollection = ['geoJSON']
    app1Data = []
    collectionForMap = db[mongoCollection]
    cfMap = list(collectionForMap.find())
    del cfMap[0]['_id']
    app1Data.append({mongoCollection:cfMap[0]})
    app1Data = json.dumps(app1Data, default=json_util.default)
    return app1Data



@app.route("/")
def welcome():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/index.html")
def welcome1():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/assets/templates/map.html")
def geomap():
    """Return the leaflet map"""
    return render_template("map.html", appData=mapData())


@app.route("/assets/templates/bubble.html")
def bubbles():
    """Return the bubble charts."""
    return render_template("bubble.html", appData=appData)


@app.route("/assets/templates/scatter.html")
def scatter():
    """Return the scatter plots."""
    return render_template("scatter.html")

@app.route("/data")
def data():
    print(appData)
    return  appData



if __name__ == '__main__':
    app.run(debug=True)

