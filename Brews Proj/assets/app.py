from flask import Flask, render_template

app = Flask(__name__)

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
    return render_template("map.html")


@app.route("/assets/templates/bubble.html")
def bubbles():
    """Return the bubble charts."""
    return render_template("bubble.html")


@app.route("/assets/templates/scatter.html")
def scatter():
    """Return the scatter plots."""
    return render_template("scatter.html")

