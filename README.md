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

The first thing you'll see logging in is the roll-up of all the fundamental things you wanted to remember or which are essential to remember because they will, are, or were due.

We also provide easy-to-use charts. They allow you to see more clearly how your progression in completing the items in your lists is going. A calendar is also available for grouping the items by the day they'll be due or by the day you told us to remind them.

You don't have to worry about having too many lists or too many to-dos. With our efficient search functionality, you can search between all items you previously tagged and see in which list you inserted them.

But the most prominent feature is collaboration! You can share your lists with your friends to make them help you. In this way, you can complete the tasks you created together. No account is required! A new member can access the list as an anonymous user: you decide if it can access the list or not. Moreover, the access is only temporary: when the user leaves the page will need to request access to the list again. Whenever anyone modifies a list you're in will receive a notification in real-time about what happened.

This app keeps on giving: a system of achievements is in place, making the organization of your daily tasks fun!

## How (to install)?

The installation procedure of the whole app under any system is fast and easy. It comes in three different flavors.

### Do-It-Yourself

Wanna feel like a real programmer? You can boot up the application from scratch in development mode piece by piece on your local machine. You need to:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Install all dependencies required by the server with ```npm install```.
4. Start the cluster of MongoDB databases with ```npx run-rs```.
5. Start the Node server with ```node index.js```.
6. Move to the folder which contains the client implementation with ```cd client```.
7. Install all dependencies required by the client with ```npm install```.
8. Start the React development server with ```npm run start```.

This option is the most complicated of all three because it has more steps than the others. It needs git, Node.js, and the "npm" package manager installed on your local machine. ⚠️ **It's fundamental that the Node version installed onto the system is 16.1.1.** ⚠️ No need for MongoDB, make, or Docker, though.
The only benefit is that, after all the steps are complete, your browser will automatically open the application home page. This procedure does not insert demo data into the MongoDB replica set. If you don't care about developing something onto this application and only want to see it running, we recommend you follow the following procedure instead.

### Pull the required images from DockerHub

You don't need to build the images for the Docker containers used by this app all by yourself. We have you covered: you can download the images available on the DockerHub website and then use those for deploying the app on your machine. You can do this in three easy steps:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Deploy the application using ```make up```.

### Build your images

If you don't trust us and our images on whatever grounds, you can always build them yourself. The procedure for compiling and deploying the app will take more time, but in the end, the result will be the same. The steps are the ones that follow, which are very similar to the ones before:

1. Clone this repo.
2. Move to the main folder of this repo with ```cd todo-app```.
3. Compile and deploy the application using ```make```.

Et voilà!

### Accessing the application

Regardless of which of the last two procedures you followed, when the two messages

> "Node API server started"

> "Connection with the database established"

appear on-screen, the installation of this app onto your system is complete. If you want to use it, reach ```localhost:8080``` from your browser to access the app. The app may take some seconds to make those messages appear, so be patient for a bit. If the app exits unexpectedly during this phase, please retry.

The last two installations will require git, make, and Docker to be working and nothing else. Node, npm, MongoDB, and MongoDB replica set services will be installed and configured automatically.

## How (to use and shut down the application)?

If you follow a given procedure for installing the application, it inserts some demo data into the database. These are some pre-defined accounts with possible data the user associated with them could have generated. The accounts are:

| Username | Email                     | Password  |
|----------|---------------------------|-----------|
| sara     | sara.camporesi@mail.com   | Password1 |
| lucy     | lucia.hu@mail.com         | Password1 |
| chiarina | chiara.lombardi@mail.com  | Password1 |
| marco_98 | marco.venturi@mail.com    | Password1 |
| ale      | alessandro.raggi@mail.com | Password1 |
| dalia    | dalia.giunchi@mail.com    | Password1 |

If you want to shut down the application, you only need to execute the command ```make down``` and Docker will shut down all containers and delete them.

## One last thing, what about the name?

Who doesn't like waffles, amirite? Moreover, this project is for a course whose acronym is "W.A.S." The letters in order are part of the word "WAffleS." Neat, huh?
