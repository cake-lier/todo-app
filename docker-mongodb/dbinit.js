const conn = new Mongo();
const db = conn.getDB('todo');

// crea le collection
db.createCollection('users', function(err, collection) {});
db.createCollection('lists', function(err, collection) {});
db.createCollection('items', function(err, collection) {});
db.createCollection('notifications', function(err, collection) {});

//inserisci i dati
db.users.insertMany(
  [{
    "_id": new ObjectId("6229c7ba9db0b0bebb8e893f"),
    "username": "sara",
    "email": "sara.camporesi@mail.com",
    "password": "$2b$12$eDuqYwEjM50Iec5zZZINm.ouCd/Taom1STuKdQ7tWpYSBULpq.kAK",
    "profilePicturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [
      new ObjectId("622b1c59306b101347f917bf")
    ],
    "achievements": [
      null,
      null,
      null,
      new Date("2022-03-26T10:26:10.898Z"),
      new Date("2022-06-04T14:01:07.506Z"),
      null,
      null,
      null,
      null,
      null,
      new Date("2021-12-19T10:49:06.565Z"),
      new Date("2021-12-19T09:49:17.044Z"),
      new Date("2021-12-19T09:42:08.433Z"),
      new Date("2021-12-28T10:00:33.372Z")
    ],
    "completedTasks": 10,
    "creationDate": new Date("2021-12-19T09:41:14.290Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229c8389db0b0bebb8e895c"),
    "username": "lucy",
    "email": "lucia.hu@mail.com",
    "password": "$2b$12$/WHW9U/.YjBHytLnLfDBROsVNHn6Dh9SvJGNUQvtWCN7vWK5uFnZG",
    "profilePicturePath": "/images/profilePictures/550e3ca0_cb9c_4901_8982_4384c7f6dd45.png",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [
      new ObjectId("622b1c59306b101347f917bf")
    ],
    "achievements": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date("2022-03-11T10:51:12.847Z"),
      null,
      null,
      new Date("2022-01-31T10:06:06.414Z")
    ],
    "completedTasks": 3,
    "creationDate": new Date("2021-12-19T09:43:20.136Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229c8b29db0b0bebb8e896c"),
    "username": "chiarina",
    "email": "chiara.lombardi@mail.com",
    "password": "$2b$12$ASbzsEKFQmyzvcseVz2kcube7k7vpS20DvxFdC0oKqStixMS5qp0i",
    "profilePicturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [],
    "achievements": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date("2022-03-10T10:13:12.849Z")
    ],
    "completedTasks": 1,
    "creationDate": new Date("2021-12-19T09:45:22.559Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221c8de1e18e4350a7c22b5"),
    "username": "marco_98",
    "email": "marco.venturi@mail.com",
    "password": "$2b$12$xrzLRqrweLDHYXMyMqKMoeHe5.NYQuVM6lpZqtfHedzn9w8Sh.raS",
    "profilePicturePath": "/images/profilePictures/547001f8_dffd_4190_bfd9_8be679417b00.png",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [],
    "achievements": [
      null,
      null,
      null,
      new Date("2022-03-30T11:25:00.803Z"),
      new Date("2022-05-05T16:18:37.340Z"),
      null,
      null,
      null,
      null,
      null,
      new Date("2022-01-20T08:07:58.031Z"),
      null,
      new Date("2022-02-01T10:12:14.220Z"),
      new Date("2022-02-10T10:13:44.365Z"),
      null
    ],
    "completedTasks": 10,
    "creationDate": new Date("2022-01-15T08:07:58.031Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b2e3ef7be0b944aa3a7d7"),
    "username": "ale",
    "email": "alessandro.raggi@mail.com",
    "password": "$2b$12$.WFYNEsauclwD7nmwvIqe.02skR3sfypsVOiZU/dIdLdjqlejmnvG",
    "profilePicturePath": "/images/profilePictures/c11b2a42_47fd_4af7_9b73_1031dc1fc663.jpeg",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [],
    "achievements": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date("2022-03-21T11:41:58.743Z"),
      new Date("2022-03-21T11:40:31.708Z"),
      new Date("2022-01-15T13:08:41.068Z")
    ],
    "completedTasks": 1,
    "creationDate": new Date("2022-01-11T11:10:54.515Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b2e93f7be0b944aa3a7dd"),
    "username": "dalia",
    "email": "dalia.giunchi@mail.com",
    "password": "$2b$12$yrXX3cnh6.h2aq76.TfVSu9ZBGC8iDD9TTarOccxKmUx0/OrVG4kC",
    "profilePicturePath": "/images/profilePictures/1f93ddb0_1f76_46fd_ae5c_41fe1c739aed.jpeg",
    "notificationsEnabled": true,
    "disabledNotificationsLists": [],
    "achievements": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date("2022-03-12T09:57:24.804Z"),
      new Date("2022-01-14T13:07:15.258Z"),
      new Date("2022-01-14T13:06:18.790Z"),
      new Date("2022-03-11T13:18:18.824Z")
    ],
    "completedTasks": 1,
    "creationDate": new Date("2022-01-11T11:12:19.211Z"),
    "__v": 0
  }]
);

db.notifications.insertMany(
  [{
    "_id": new ObjectId("6229c99d9fd80e508ca0b279"),
    "authorUsername": "sara",
    "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
    "users": [
      new ObjectId("6229c8389db0b0bebb8e895c")
    ],
    "text": " added you to the the list \"uscite con bffs\"",
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "listTitle": null,
    "insertionDate": new Date("2021-12-19T09:49:17.027Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229c99d9fd80e508ca0b27d"),
    "authorUsername": null,
    "picturePath": "/images/achievements/11.png",
    "users": [
      new ObjectId("6229c7ba9db0b0bebb8e893f")
    ],
    "text": "Achievement unlocked: your first collaboration!",
    "listId": null,
    "listTitle": null,
    "insertionDate": new Date("2021-12-19T09:49:17.049Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229ca0a9fd80e508ca0b2bf"),
    "authorUsername": "sara",
    "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
    "users": [
      new ObjectId("6229c8b29db0b0bebb8e896c")
    ],
    "text": " added you to the the list \"uscite con bffs\"",
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "listTitle": null,
    "insertionDate": new Date("2021-12-19T09:51:06.020Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229ca0a9fd80e508ca0b2c1"),
    "authorUsername": "sara",
    "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
    "users": [
      new ObjectId("6229c8389db0b0bebb8e895c")
    ],
    "text": " added the new member chiarina to the list \"uscite con bffs\"",
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "listTitle": null,
    "insertionDate": new Date("2021-12-19T09:51:06.028Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229cd4c9fd80e508ca0b419"),
    "authorUsername": "lucy",
    "picturePath": "/images/profilePictures/550e3ca0_cb9c_4901_8982_4384c7f6dd45.png",
    "users": [
      new ObjectId("6229c7ba9db0b0bebb8e893f")
    ],
    "text": " set the item \"Mostra Real Bodies\" as complete",
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "listTitle": "uscite con bffs",
    "insertionDate": new Date("2022-01-08T21:05:00.259Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229cf5a9fd80e508ca0b62f"),
    "authorUsername": "chiarina",
    "picturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
    "users": [
      new ObjectId("6229c7ba9db0b0bebb8e893f")
    ],
    "text": " set the item \"Festival dell'Oriente\" as complete",
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "listTitle": "uscite con bffs",
    "insertionDate": new Date("2022-04-10T23:13:46.110Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b1cbb306b101347f9181e"),
    "authorUsername": "sara",
    "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
    "users": [
      new ObjectId("6229c8389db0b0bebb8e895c")
    ],
    "text": " added you to the the list \"iSushi\"",
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "listTitle": null,
    "insertionDate": new Date("2022-06-04T12:45:11.730Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b1da5306b101347f91853"),
    "authorUsername": "emma",
    "picturePath": null,
    "users": [
      new ObjectId("6229c8389db0b0bebb8e895c")
    ],
    "text": " joined the list \"iSushi\"",
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "listTitle": null,
    "insertionDate": new Date("2022-06-04T12:45:15.458Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b1e13306b101347f91896"),
    "authorUsername": "fede",
    "picturePath": null,
    "users": [
      new ObjectId("6229c8389db0b0bebb8e895c")
    ],
    "text": " joined the list \"iSushi\"",
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "listTitle": null,
    "insertionDate": new Date("2022-06-04T12:45:55.994Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221c9d01e18e4350a7c2321"),
    "authorUsername": null,
    "picturePath": null,
    "users": [
      new ObjectId("6221c8de1e18e4350a7c22b5")
    ],
    "text": "Don't forget the item \"assignment #2\": it's due  May 09 2022!",
    "listId": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "listTitle": null,
    "insertionDate": new Date("2022-05-09T18:00:00Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221c9d01e18e4350a7c2323"),
    "authorUsername": null,
    "picturePath": null,
    "users": [
      new ObjectId("6221c8de1e18e4350a7c22b5")
    ],
    "text": "Don't forget the item \"assignment #1\": it's due  Apr 11 2022!",
    "listId": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "listTitle": null,
    "insertionDate": new Date("2022-04-10T18:00:00Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221ccd01e18e4350a7c2541"),
    "authorUsername": null,
    "picturePath": "/images/achievements/3.png",
    "users": [
      new ObjectId("6221c8de1e18e4350a7c22b5")
    ],
    "text": "Achievement unlocked: 5 items completed!",
    "listId": null,
    "listTitle": null,
    "insertionDate": new Date("2022-03-30T11:25:00.803Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221e77def1d809a34c39fb8"),
    "authorUsername": null,
    "picturePath": "/images/achievements/4.png",
    "users": [
      new ObjectId("6221c8de1e18e4350a7c22b5")
    ],
    "text": "Achievement unlocked: 10 items completed!",
    "listId": null,
    "listTitle": null,
    "insertionDate": new Date("2022-05-05T16:18:37.340Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b494a181361c7f5d2516c"),
    "authorUsername": null,
    "picturePath": "/images/achievements/12.png",
    "users": [
      new ObjectId("622b2e93f7be0b944aa3a7dd")
    ],
    "text": "Achievement unlocked: your first list!",
    "listId": null,
    "listTitle": null,
    "insertionDate": new Date("2022-01-14T13:06:18.790Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b4983181361c7f5d2519d"),
    "authorUsername": null,
    "picturePath": "/images/achievements/11.png",
    "users": [
      new ObjectId("622b2e93f7be0b944aa3a7dd")
    ],
    "text": "Achievement unlocked: your first collaboration!",
    "listId": null,
    "listTitle": null,
    "insertionDate": new Date("2022-01-14T13:07:15.262Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b4bc8181361c7f5d25287"),
    "authorUsername": "dalia",
    "picturePath": "/images/profilePictures/1f93ddb0_1f76_46fd_ae5c_41fe1c739aed.jpeg",
    "users": [
      new ObjectId("622b2e3ef7be0b944aa3a7d7")
    ],
    "text": " set the item \"pagare bolletta\" as complete",
    "listId": new ObjectId("622b494a181361c7f5d25165"),
    "listTitle": "casa",
    "insertionDate": new Date("2022-03-18T17:16:56.450Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b4cc9181361c7f5d252e0"),
    "authorUsername": "dalia",
    "picturePath": "/images/profilePictures/1f93ddb0_1f76_46fd_ae5c_41fe1c739aed.jpeg",
    "users": [
      new ObjectId("622b2e3ef7be0b944aa3a7d7")
    ],
    "text": " added themselves to the item \"pagare bolletta\"",
    "listId": new ObjectId("622b494a181361c7f5d25165"),
    "listTitle": "casa",
    "insertionDate": new Date("2022-03-18T16:21:13.131Z"),
    "__v": 0
  },{
    "_id": new ObjectId("623864d4a1cad9545088fc8f"),
    "authorUsername": "dalia",
    "picturePath": "/images/profilePictures/1f93ddb0_1f76_46fd_ae5c_41fe1c739aed.jpeg",
    "users": [
      new ObjectId("622b2e3ef7be0b944aa3a7d7")
    ],
    "text": " created the new item \"burro \"",
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "listTitle": "lista della spesa",
    "insertionDate": new Date("2022-05-21T17:43:16.671Z"),
    "__v": 0
  }]
);

db.lists.insertMany(
  [{
    "_id": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "title": "Uscite con bffs",
    "joinCode": "2fgNp4",
    "colorIndex": 1,
    "members": [
      {
        "userId": new ObjectId("6229c7ba9db0b0bebb8e893f"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6229c7f09db0b0bebb8e894a")
      },
      {
        "userId": new ObjectId("6229c8389db0b0bebb8e895c"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("6229c99d9fd80e508ca0b272")
      },
      {
        "userId": new ObjectId("6229c8b29db0b0bebb8e896c"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("6229ca099fd80e508ca0b2b7")
      }
    ],
    "creationDate": new Date("2021-12-19T09:42:08.433Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6229d0fc9fd80e508ca0b7df"),
    "title": "Film da vedere assolutamente!!",
    "joinCode": null,
    "colorIndex": 0,
    "members": [
      {
        "userId": new ObjectId("6229c7ba9db0b0bebb8e893f"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6229d0fc9fd80e508ca0b7e0")
      }
    ],
    "creationDate": new Date("2022-01-10T10:20:44.333Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b1c59306b101347f917bf"),
    "title": "iSushi",
    "joinCode": "O6P3NN",
    "colorIndex": 2,
    "members": [
      {
        "userId": new ObjectId("6229c7ba9db0b0bebb8e893f"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("622b1c59306b101347f917c0")
      },
      {
        "userId": new ObjectId("6229c8389db0b0bebb8e895c"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("622b1cbb306b101347f91817")
      },
      {
        "userId": null,
        "username": "emma",
        "anonymousId": "c9366355-8302-44c6-8dc6-50bf398e73a1",
        "role": "member",
        "_id": new ObjectId("622b1da5306b101347f9184c")
      },
      {
        "userId": null,
        "username": "fede",
        "anonymousId": "5615f953-945e-4631-a799-28cfab68cd48",
        "role": "member",
        "_id": new ObjectId("622b1e13306b101347f9188e")
      }
    ],
    "creationDate": new Date("2022-06-04T12:44:33.983Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "title": "pcd",
    "joinCode": null,
    "colorIndex": 0,
    "members": [
      {
        "userId": new ObjectId("6221c8de1e18e4350a7c22b5"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6221c90e1e18e4350a7c22bd")
      }
    ],
    "creationDate": new Date("2022-02-22T08:08:46.542Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "pps",
    "joinCode": null,
    "colorIndex": 1,
    "members": [
      {
        "userId": new ObjectId("6221c8de1e18e4350a7c22b5"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6221ca0b1e18e4350a7c2345")
      }
    ],
    "creationDate": new Date("2022-02-21T18:12:59.460Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6221e5feef1d809a34c39ee3"),
    "title": "exams",
    "joinCode": null,
    "colorIndex": 2,
    "members": [
      {
        "userId": new ObjectId("6221c8de1e18e4350a7c22b5"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6221e5feef1d809a34c39ee4")
      }
    ],
    "creationDate": new Date("2022-02-01T10:12:14.220Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b494a181361c7f5d25165"),
    "title": "casa",
    "joinCode": null,
    "colorIndex": 0,
    "members": [
      {
        "userId": new ObjectId("622b2e93f7be0b944aa3a7dd"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("622b494a181361c7f5d25166")
      },
      {
        "userId": new ObjectId("622b2e3ef7be0b944aa3a7d7"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("622b4983181361c7f5d25192")
      }
    ],
    "creationDate": new Date("2022-01-14T13:06:18.790Z"),
    "__v": 0
  },{
    "_id": new ObjectId("622b4dca181361c7f5d253aa"),
    "title": "cosa portare in valigia",
    "joinCode": null,
    "colorIndex": 1,
    "members": [
      {
        "userId": new ObjectId("622b2e93f7be0b944aa3a7dd"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("622b4dca181361c7f5d253ab")
      },
      {
        "userId": new ObjectId("622b2e3ef7be0b944aa3a7d7"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("622b4f69181361c7f5d254b0")
      }
    ],
    "creationDate": new Date("2022-04-11T13:25:30.805Z"),
    "__v": 0
  },{
    "_id": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "lista della spesa",
    "joinCode": null,
    "colorIndex": 3,
    "members": [
      {
        "userId": new ObjectId("622b2e3ef7be0b944aa3a7d7"),
        "username": null,
        "anonymousId": null,
        "role": "owner",
        "_id": new ObjectId("6238642fa1cad9545088fb9d")
      },
      {
        "userId": new ObjectId("622b2e93f7be0b944aa3a7dd"),
        "username": null,
        "anonymousId": null,
        "role": "member",
        "_id": new ObjectId("62386486a1cad9545088fbec")
      }
    ],
    "creationDate": new Date("2022-03-21T11:40:31.697Z"),
    "__v": 0
  }]
);

db.items.insertMany(
  [{
    "_id": new ObjectId("6229cc419fd80e508ca0b374"),
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "title": "Mostra Real Bodies",
    "dueDate": new Date("2022-01-08T22:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2021-01-08T21:05:00.259Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2021-12-28T10:00:33.366Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229cd8e9fd80e508ca0b432"),
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "title": "Mostra Essere Umane",
    "dueDate": new Date("2022-02-19T22:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-02-19T19:11:55.870Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-01-31T10:06:06.406Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229cf389fd80e508ca0b5d8"),
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "title": "Festival dell'Oriente",
    "dueDate": new Date("2022-04-10T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-04-10T23:13:46.110Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-03-10T10:13:12.843Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229cffd9fd80e508ca0b6b2"),
    "listId": new ObjectId("6229c7f09db0b0bebb8e8949"),
    "title": "Artevento - Festival Aquiloni",
    "dueDate": new Date("2022-06-30T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-30T10:16:29.126Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229d1669fd80e508ca0b7f3"),
    "listId": new ObjectId("6229d0fc9fd80e508ca0b7df"),
    "title": "Raya and the Last Dragon",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-01-07T10:25:41.750Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2021-12-26T10:22:30.414Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229d1839fd80e508ca0b7fd"),
    "listId": new ObjectId("6229d0fc9fd80e508ca0b7df"),
    "title": "Dune",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-02-26T10:25:46.373Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-01-10T10:22:59.488Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229d2119fd80e508ca0b81b"),
    "listId": new ObjectId("6229d0fc9fd80e508ca0b7df"),
    "title": "Crazy Rich Asians",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-03-10T10:25:21.356Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6229d2239fd80e508ca0b82f"),
    "listId": new ObjectId("6229d0fc9fd80e508ca0b7df"),
    "title": "Luca",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-25T10:25:39.169Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("622b1fba306b101347f918ec"),
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "title": "11B - involtini gamberi",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-06-04T13:32:23.463Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 0,
    "priority": false,
    "creationDate": new Date("2022-06-04T12:57:58.654Z"),
    "assignees": [
      {
        "memberId": new ObjectId("622b1c59306b101347f917c0"),
        "count": 1,
        "_id": new ObjectId("622b2000306b101347f91909")
      }
    ],
    "__v": 0
  },{
    "_id": new ObjectId("622b2020306b101347f9193b"),
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "title": "18 - saomai",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-06-04T13:35:29.219Z"),
    "tags": [],
    "count": 2,
    "remainingCount": 0,
    "priority": false,
    "creationDate": new Date("2022-06-04T12:59:40.772Z"),
    "assignees": [
      {
        "memberId": new ObjectId("622b1cbb306b101347f91817"),
        "count": 1,
        "_id": new ObjectId("622b2028306b101347f91970")
      },
      {
        "memberId": new ObjectId("622b1da5306b101347f9184c"),
        "count": 1,
        "_id": new ObjectId("622b202f306b101347f919b8")
      }
    ],
    "__v": 0
  },{
    "_id": new ObjectId("622b2162306b101347f91ddf"),
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "title": "30 - nighiri sake",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-06-04T13:47:42.198Z"),
    "tags": [],
    "count": 2,
    "remainingCount": 0,
    "priority": false,
    "creationDate": new Date("2022-06-04T13:08:02.377Z"),
    "assignees": [
      {
        "memberId": new ObjectId("622b1e13306b101347f9188e"),
        "count": 2,
        "_id": new ObjectId("622b216a306b101347f91e86")
      }
    ],
    "__v": 0
  },{
    "_id": new ObjectId("622b21a2306b101347f91f39"),
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "title": "118 - sashimi sake",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-06-04T13:52:58.526Z"),
    "tags": [
      {
        "title": "da condividere",
        "colorIndex": 3,
        "_id": new ObjectId("622b21f6306b101347f924ca")
      }
    ],
    "count": 3,
    "remainingCount": 3,
    "priority": false,
    "creationDate": new Date("2022-06-04T13:09:06.427Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("622b2225306b101347f9258e"),
    "listId": new ObjectId("622b1c59306b101347f917bf"),
    "title": "28 - tempura ebi",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": new Date("2022-06-04T13:55:59.583Z"),
    "tags": [
      {
        "title": "da condividere",
        "colorIndex": 3,
        "_id": new ObjectId("622b222d306b101347f92628")
      }
    ],
    "count": 2,
    "remainingCount": 2,
    "priority": false,
    "creationDate": new Date("2022-06-04T13:10:17.056Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221c9471e18e4350a7c22d6"),
    "listId": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "title": "assignment #1",
    "dueDate": new Date("2022-04-11T21:59:59.999Z"),
    "reminderDate": new Date("2022-04-10T18:00:00Z"),
    "completionDate": new Date("2022-04-11T17:24:41.355Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-03-08T08:09:43.135Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221c9501e18e4350a7c22e6"),
    "listId": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "title": "assignment #2",
    "dueDate": new Date("2022-05-09T21:59:59.999Z"),
    "reminderDate": new Date("2022-05-09T18:00:00Z"),
    "completionDate": new Date("2022-05-09T20:09:42.349Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-12T17:23:52.558Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221c95a1e18e4350a7c22f0"),
    "listId": new ObjectId("6221c90e1e18e4350a7c22bc"),
    "title": "assignment #3",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [
      {
        "title": "no deadline",
        "colorIndex": 0,
        "_id": new ObjectId("6221c9e11e18e4350a7c232a")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-24T08:10:02.134Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221caf71e18e4350a7c239a"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-3 streams",
    "dueDate": new Date("2022-03-23T22:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-03-24T23:24:48.585Z"),
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cc851e18e4350a7c2434")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-03-17T08:16:55.314Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb051e18e4350a7c23a4"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-4 OOP",
    "dueDate": new Date("2022-03-30T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-03-30T11:24:49.803Z"),
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cc8c1e18e4350a7c243f")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-03-23T19:17:09.540Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb101e18e4350a7c23ae"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-5 FP+OOP",
    "dueDate": new Date("2022-04-06T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-04-07T23:24:51.704Z"),
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cc911e18e4350a7c244a")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-01T17:17:20.510Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb211e18e4350a7c23bf"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-6 advanced scala",
    "dueDate": new Date("2022-04-20T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cc961e18e4350a7c2455")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-06T10:17:37.690Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb2c1e18e4350a7c23c9"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-10 prolog",
    "dueDate": new Date("2022-05-18T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-05-23T18:24:55.273Z"),
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cc9c1e18e4350a7c2460")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-21T12:17:48.861Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb321e18e4350a7c23d3"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-11 prolog",
    "dueDate": new Date("2022-05-25T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221cca51e18e4350a7c246b")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-18T23:07:54.984Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221cb411e18e4350a7c23dd"),
    "listId": new ObjectId("6221ca0b1e18e4350a7c2344"),
    "title": "lab-12 prolog+scala",
    "dueDate": new Date("2022-06-01T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [
      {
        "title": "soft deadline",
        "colorIndex": 1,
        "_id": new ObjectId("6221ccbe1e18e4350a7c247d")
      }
    ],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-27T17:38:09.018Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221e658ef1d809a34c39ef7"),
    "listId": new ObjectId("6221e5feef1d809a34c39ee3"),
    "title": "sistemi informativi (orale)",
    "dueDate": new Date("2022-03-04T22:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-03-04T16:13:54.499Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-02-10T10:13:44.365Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221e745ef1d809a34c39f53"),
    "listId": new ObjectId("6221e5feef1d809a34c39ee3"),
    "title": "LCMC (orale)",
    "dueDate": new Date("2022-05-05T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-05-05T16:18:37.340Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-04-17T10:17:41.027Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221e766ef1d809a34c39f64"),
    "listId": new ObjectId("6221e5feef1d809a34c39ee3"),
    "title": "sicurezza delle reti (scritto)",
    "dueDate": new Date("2022-06-27T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-24T10:18:14.498Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6221e7adef1d809a34c3a006"),
    "listId": new ObjectId("6221e5feef1d809a34c39ee3"),
    "title": "business intelligence (scritto)",
    "dueDate": new Date("2022-07-11T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-06-04T10:19:25.572Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("622b49d9181361c7f5d251d5"),
    "listId": new ObjectId("622b494a181361c7f5d25165"),
    "title": "pagare bolletta",
    "dueDate": new Date("2022-03-20T22:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-03-18T13:16:56.450Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 0,
    "priority": true,
    "creationDate": new Date("2022-02-28T13:08:41.061Z"),
    "assignees": [
      {
        "memberId": new ObjectId("622b494a181361c7f5d25166"),
        "count": 1,
        "_id": new ObjectId("622b4cc9181361c7f5d252dc")
      }
    ],
    "__v": 0
  },{
    "_id": new ObjectId("622b4c1a181361c7f5d25298"),
    "listId": new ObjectId("622b494a181361c7f5d25165"),
    "title": "assicurazione",
    "dueDate": new Date("2022-03-28T21:59:59.999Z"),
    "reminderDate": null,
    "completionDate": new Date("2022-03-20T13:22:27.727Z"),
    "tags": [],
    "count": 1,
    "remainingCount": 0,
    "priority": true,
    "creationDate": new Date("2022-03-11T13:18:18.821Z"),
    "assignees": [
      {
        "memberId": new ObjectId("622b4983181361c7f5d25192"),
        "count": 1,
        "_id": new ObjectId("622b4cf9181361c7f5d2532f")
      }
    ],
    "__v": 0
  },{
    "_id": new ObjectId("622b4e22181361c7f5d2541b"),
    "listId": new ObjectId("622b4dca181361c7f5d253aa"),
    "title": "documenti + passaporto",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 2,
    "remainingCount": 2,
    "priority": true,
    "creationDate": new Date("2022-04-11T13:26:58.401Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("622b4e6b181361c7f5d25425"),
    "listId": new ObjectId("622b4dca181361c7f5d253aa"),
    "title": "caricatore telefono",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 2,
    "remainingCount": 2,
    "priority": false,
    "creationDate": new Date("2022-04-11T13:28:11.506Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("62386442a1cad9545088fbb7"),
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "latte di soia",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 2,
    "remainingCount": 2,
    "priority": false,
    "creationDate": new Date("2022-05-21T11:40:50.524Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("62386457a1cad9545088fbce"),
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "petto di pollo",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-21T11:41:11.524Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("6238645ea1cad9545088fbd8"),
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "olio extra vergine",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-21T11:41:18.989Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("62386478a1cad9545088fbe2"),
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "passata di pomodoro",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-05-21T11:41:44.108Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("623864d4a1cad9545088fc8b"),
    "listId": new ObjectId("6238642fa1cad9545088fb9c"),
    "title": "burro ",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 2,
    "remainingCount": 2,
    "priority": false,
    "creationDate": new Date("2022-05-21T11:43:16.666Z"),
    "assignees": [],
    "__v": 0
  },{
    "_id": new ObjectId("62386597a1cad9545088fdde"),
    "listId": new ObjectId("622b494a181361c7f5d25165"),
    "title": "chiamare per manutenzione caldaia",
    "dueDate": null,
    "reminderDate": null,
    "completionDate": null,
    "tags": [],
    "count": 1,
    "remainingCount": 1,
    "priority": false,
    "creationDate": new Date("2022-06-11T11:46:31.340Z"),
    "assignees": [],
    "__v": 0
  }]
);
