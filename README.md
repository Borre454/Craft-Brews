# Project2-Brews
To run flask successfully, first run files: mikes_mongo_merge.ipynb, data_cleanup_final.ipynb, and mergeCSV-JSON.ipynb from the data cleanup folder. These notebooks will initialize the Mongo databases that each of the javascript files will respectively pull data from. After the cleanup files have been run, open gitbash in the folder containing app.py and use commands: "$ export FLASK_APP=app.py
$ python -m flask run" to host the program locally.


Questions We Would Like to Answer:
<br>

(Where) is craft beer most popular?
<br>
Visualize on a map where craft beer is most popular based on the amount of brewerys in each State.
<br>

(What) aspects make a craft beer popular?
<br>
Visualize using a bubble plot the average ratings by score and ABV %.
<br>

(When/How) did the market for craft beer change?
<br>
Line graph of historical data showing total craft barrels each year since 1971.
<br>

Data Source:<br>
https://data.world/gswider/2013-acbf-styles-ratings
