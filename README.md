# Waffles - The to-do app

## Why?

The project contained in this repository is our submission for the exam "Web Applications and Services" part of the course "Computer Science and Engineering - L.M." at "Alma Mater Studiorum - University of Bologna" for the academic year 2021 - 2022.

## Who?

The members of the team behind the project are:

* Elena Rughi
* Matteo Castellucci
* Yuqi Sun

## What?

We developed a single-page application for saving all your precious to-do lists, so you can keep track of all the things you need to remember during your day. But here's the thing: each item in a list is associated with a count, so you can use our app also for writing your grocery list, for keeping track of the clothes you put into your luggage, and for tracking whatever you want to count, really.

The first thing you'll see when logged in is the roll-up of all the fundamental things you wanted to remember or which are essential to remember because they will, are, or were due.

We also provide easy-to-use charts. They allow you to see more clearly how your progression in completing the items in your lists is going. A calendar is also available for grouping the items by the day they'll be due or by the day you told us to remind them.

You don't have to worry about having too many lists or too many to-dos. With our efficient search functionality, you can search between all items you previously tagged and see in which list you inserted them.

But the most prominent feature is collaboration! You can share your lists with your friends to make them help you. In this way, you can complete the tasks you created together. No account is required! A new member can access the list as an anonymous user: you decide if it can access the list or not. Moreover, the access is only temporary: when the user leaves the page will need to request access to the list again.
Whenever anyone modifies a list you're in, you will be notified in real-time of what happened.

This app keeps on giving: a system of achievements is in place for making the organization of your daily tasks fun!

## How (to install)?

The installation procedure of the whole app under any system is fast and easy. It comes in two different flavors.

### Pull the required images from DockerHub

You don't need to build the images for the Docker containers used by this app all by yourself. In fact, we have you covered: you can simply download the images which are available at the DockerHub website and then use those for deploying the app on your machine. You can do this in three easy steps:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Deploy the application using ```make up```.

### Build your own images

If you don't trust us for whatever reason, and with us our images, you can always build them yourself. The procedure for compiling and deploying the app will take more time, but in the end, the result will be the same. The steps are the ones that follows, which are very similar to the ones before:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Compile and deploy the application using ```make```.

Et voilà! 

### Accessing the application

Regardless of which procedure you followed, when the two messages

> "Connection with the database established"

> "Node API server started" 

appear on-screen the app will be correctly installed onto your system. For using it, just reach ``` localhost:8080 ``` from your browser to access the app. The app may take some seconds to load, so be patient for a bit.

The installation will require git, make, and Docker to correctly work and nothing else. Node, npm, MongoDB, and its replica set services will be installed and set up automatically.

## One last thing... What about the name?

Who doesn't like waffles, amirite? Moreover, the acronym for the name of the course for which this project was realized is "W.A.S." The letters in order are contained in the word "WAffleS." Neat, huh?
