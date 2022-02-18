# Waffles - The to-do app

## Why?

The project contained in this repository is our submission for the exam "Web Applications and Services", part of the course "Computer Science and Engineering - LM" at "Alma Mater Studiorum - University of Bologna" for the academic year 2021 - 2022.

## Who?

The members of the team behind the project are:

* Elena Rughi
* Matteo Castellucci
* Yuqi Sun

## What?

We developed a single page application for keeping all your precious to-do lists for you, so you can keep track of all the things you need to remember during your day. But here's the thing: to each item in a list is associated a count, so you can use our app also for keeping track of the tallies in your grocery list, of the clothes you put into your luggage, but also whatever you want to count, really.

We also provide easy to use charts for seeing more clearly how your progression in completing the items in your list is going, but also a calendar for displaying the items in the day they'll be due or in the day you told us to remind them.

...

## How (to install)?

The installation procedure of the whole app under any system is very simple. 

1. For first, just clone this repo with:

    > git clone https://github.com/cake-lier/todo-app.git

2. Then, move to the main folder of the cloned repo with:

    > cd todo-app

3. As last step, compile the project using:

    > make

Et voilà, when the installation will complete and the messages will stop appearing the app will be correctly installed onto your system and ready to use. Just reach

> localhost:8080

from your browser for accessing the app.

The installation will require Docker to correctly work, because it needs to deploy five containers: one for the node platform plus the express web server on which the app is hosted, three for the MongoDB instances which make the replica set used as storage for user data and a last one for setting up the replica set from the MongoDB instances.

## One last thing... What about the name?

Who doesn't like waffles, amirite? Moreover, "WAffleS" contains the acronym of the name of the course for which this project was realized, which is "W.A.S.".