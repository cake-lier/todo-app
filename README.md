# Waffles - The to-do app

## Why?

The image contained in this repository is part of our submission for the exam "Web Applications and Services" part of the course "Computer Science and Engineering - L.M." at "Alma Mater Studiorum - University of Bologna" for the academic year 2021 - 2022.

## Who?

The members of the team behind the project are:

* Elena Rughi
* Matteo Castellucci
* Yuqi Sun

## What?

We developed a single-page application for saving all your precious to-do lists, so you can keep track of all the things you need to remember during your day. But here's the thing: each item in a list is associated with a count, so you can use our app also for writing your grocery list, keeping track of the clothes you put into your luggage, and tracking whatever you want to count.

The first thing you'll see when logged in is the roll-up of all the fundamental things you wanted to remember or which are essential to remember because they will, are, or were due.

We also provide easy-to-use charts. They allow you to see more clearly how your progression in completing the items in your lists is going. A calendar is also available for grouping the items by the day they'll be due or by the day you told us to remind them.

You don't have to worry about having too many lists or too many to-dos. With our efficient search functionality, you can search between all items you previously tagged and see in which list you inserted them.

But the most prominent feature is collaboration! You can share your lists with your friends to make them help you. In this way, you can complete the tasks you created together. No account is required! A new member can access the list as an anonymous user: you decide if it can access the list or not. Moreover, the access is only temporary: when the user leaves the page will need to request access to the list again.
Whenever anyone modifies a list you're in, you will be notified in real-time of what happened.

This app keeps on giving: a system of achievements is in place for making the organization of your daily tasks fun!

## How (to install)?

The installation procedure of the whole app under any system is fast and easy. It comes in three different flavors.

### Do-It-Yourself

Wanna feel like a real programmer? You can boot up the application from scratch in development mode piece by piece on your local machine. You just need to:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Install all dependencies required by the server with ```npm install```.
4. Start the cluster of MongoDB databases with ```npx run-rs```.
5. Start the Node server with ```node index.js```.
6. Move to the folder containing the client implementation with ```cd client```.
7. Install all dependencies required by the client with ```npm install```.
8. Start the React development server with ```npm run start```.

This option is the most complicated of all three, because it has more steps than the others and it needs that git, Node.js and the NPM package manager are all installed on your local machine. No need for MongoDB, make or Docker, though. The only advantage is that, when all the steps are completed, your browser will automatically open the home page of the application. When following this procedure, no demo data will be inserted into the MongoDB replica set. If you don't care for developing something onto this application and just want to see it running, we recommend you to follow the next procedure instead.

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

Regardless of which of the last two procedures you followed, when the two messages

> "Node API server started"

> "Connection with the database established"

appear on-screen the app will be correctly installed onto your system. For using it, just reach ``` localhost:8080 ``` from your browser to access the app. The app may take some seconds to make those messages appear, so be patient for a bit. If the app exits unexpectedly during this phase, please retry.

The last two installations will require git, make, and Docker to correctly work and nothing else. Node, npm, MongoDB, and its replica set services will be installed and set up automatically.

## One last thing... What about the name?

Who doesn't like waffles, amirite? Moreover, the acronym for the name of the course for which this project was realized is "W.A.S." The letters in order are contained in the word "WAffleS." Neat, huh?
