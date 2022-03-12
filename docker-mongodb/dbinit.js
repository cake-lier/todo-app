var conn = new Mongo();
var db = conn.getDB('todo');

// crea collection 'alignments' e la lascia se già esiste
db.createCollection('users', function(err, collection) {});
db.createCollection('lists', function(err, collection) {});
db.createCollection('items', function(err, collection) {});
db.createCollection('notifications', function(err, collection) {});


// elimina gli eventuali documenti della collection 'alignments'
// nel caso esistesse già
try {
    db.users.deleteMany( { } );
    db.lists.deleteMany( { } );
    db.items.deleteMany( { } );
    db.notifications.deleteMany( { } );
} catch (e) {
    print (e);
}

db.users.insertMany(
    [{
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
          null,
          null,
          {
            "$date": "2022-01-15T13:08:41.068Z"
          }
        ],
        "completedTasks": 1,
        "creationDate": {
          "$date": "2022-01-11T11:10:54.515Z"
        }
      },{
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
          {
            "$date": "2022-03-12T09:57:24.804Z"
          },
          {
            "$date": "2022-01-14T13:07:15.258Z"
          },
          {
            "$date": "2022-01-14T13:06:18.790Z"
          },
          {
            "$date": "2022-03-11T13:18:18.824Z"
          }
        ],
        "completedTasks": 1,
        "creationDate": {
          "$date": "2022-01-11T11:12:19.211Z"
        }
      },{
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
          {
            "$date": "2022-03-30T11:25:00.803Z"
          },
          {
            "$date": "2022-05-05T16:18:37.340Z"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "$date": "2022-01-20T08:07:58.031Z"
          },
          null,
          {
            "$date": "2022-02-01T10:12:14.220Z"
          },
          {
            "$date": "2022-02-10T10:13:44.365Z"
          },
          null
        ],
        "completedTasks": 10,
        "creationDate": {
          "$date": "2022-01-15T08:07:58.031Z"
        }
      },{
        "username": "sara",
        "email": "sara.camporesi@mail.com",
        "password": "$2b$12$eDuqYwEjM50Iec5zZZINm.ouCd/Taom1STuKdQ7tWpYSBULpq.kAK",
        "profilePicturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
        "notificationsEnabled": true,
        "disabledNotificationsLists": [
          {
            "$oid": "622b1c59306b101347f917bf"
          }
        ],
        "achievements": [
          null,
          null,
          null,
          {
            "$date": "2022-03-26T10:26:10.898Z"
          },
          {
            "$date": "2022-06-04T14:01:07.506Z"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "$date": "2021-12-19T10:49:06.565Z"
          },
          {
            "$date": "2021-12-19T09:49:17.044Z"
          },
          {
            "$date": "2021-12-19T09:42:08.433Z"
          },
          {
            "$date": "2021-12-28T10:00:33.372Z"
          }
        ],
        "completedTasks": 10,
        "creationDate": {
          "$date": "2021-12-19T09:41:14.290Z"
        }
      },{
        "username": "lucy",
        "email": "lucia.hu@mail.com",
        "password": "$2b$12$/WHW9U/.YjBHytLnLfDBROsVNHn6Dh9SvJGNUQvtWCN7vWK5uFnZG",
        "profilePicturePath": "/images/profilePictures/550e3ca0_cb9c_4901_8982_4384c7f6dd45.png",
        "notificationsEnabled": true,
        "disabledNotificationsLists": [
          {
            "$oid": "622b1c59306b101347f917bf"
          }
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
          {
            "$date": "2022-03-11T10:51:12.847Z"
          },
          null,
          null,
          {
            "$date": "2022-01-31T10:06:06.414Z"
          }
        ],
        "completedTasks": 3,
        "creationDate": {
          "$date": "2021-12-19T09:43:20.136Z"
        }
      },{
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
          {
            "$date": "2022-03-10T10:13:12.849Z"
          }
        ],
        "completedTasks": 1,
        "creationDate": {
          "$date": "2021-12-19T09:45:22.559Z"
        }
      }]
);

db.notifications.insertMany(
    [{
        "authorUsername": null,
        "picturePath": null,
        "users": [
          {
            "$oid": "6221c8de1e18e4350a7c22b5"
          }
        ],
        "text": "Don't forget the item \"assignment #2\": it's due  May 09 2022!",
        "listId": {
          "$oid": "6221c90e1e18e4350a7c22bc"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-05-09T18:00:00Z"
        }
      },{
        "authorUsername": null,
        "picturePath": null,
        "users": [
          {
            "$oid": "6221c8de1e18e4350a7c22b5"
          }
        ],
        "text": "Don't forget the item \"assignment #1\": it's due  Apr 11 2022!",
        "listId": {
          "$oid": "6221c90e1e18e4350a7c22bc"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-04-10T18:00:00Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/3.png",
        "users": [
          {
            "$oid": "6221c8de1e18e4350a7c22b5"
          }
        ],
        "text": "Achievement unlocked: 5 items completed!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-03-30T11:25:00.803Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/10.png",
        "users": [
          {
            "$oid": "6221c8de1e18e4350a7c22b5"
          }
        ],
        "text": "Achievement unlocked: you visited the reports page!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-01-20T08:07:58.031Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/4.png",
        "users": [
          {
            "$oid": "6221c8de1e18e4350a7c22b5"
          }
        ],
        "text": "Achievement unlocked: 10 items completed!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-05-05T16:18:37.340Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/12.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: your first list!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T09:42:08.433Z"
        }
      },{
        "authorUsername": "sara",
        "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": " added you to the the list \"uscite con bffs\"",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T09:49:17.027Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/11.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: your first collaboration!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T09:49:17.049Z"
        }
      },{
        "authorUsername": "sara",
        "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
        "users": [
          {
            "$oid": "6229c8b29db0b0bebb8e896c"
          }
        ],
        "text": " added you to the the list \"uscite con bffs\"",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T09:51:06.020Z"
        }
      },{
        "authorUsername": "sara",
        "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": " added the new member chiarina to the list \"uscite con bffs\"",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T09:51:06.028Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/13.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: your first item!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-28T10:00:33.376Z"
        }
      },{
        "authorUsername": "lucy",
        "picturePath": "/images/profilePictures/550e3ca0_cb9c_4901_8982_4384c7f6dd45.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " set the item \"Mostra Real Bodies\" as complete",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-01-08T21:05:00.259Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/13.png",
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": "Achievement unlocked: your first item!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-01-31T10:06:06.414Z"
        }
      },{
        "authorUsername": "lucy",
        "picturePath": "/images/profilePictures/550e3ca0_cb9c_4901_8982_4384c7f6dd45.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " created the new item \"Mostra Essere Umane\"",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-01-31T10:06:06.421Z"
        }
      },{
        "authorUsername": "chiarina",
        "picturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " set the due date of the item \"Mostra Essere Umane\" to  Feb 19 2022",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-02-03T10:06:41.926Z"
        }
      },{
        "authorUsername": "chiarina",
        "picturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " created the new item \"Festival dell'Oriente\"",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-03-10T10:13:12.859Z"
        }
      },{
        "authorUsername": "chiarina",
        "picturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " set the due date of the item \"Festival dell'Oriente\" to  Apr 10 2022",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-03-10T10:13:41.458Z"
        }
      },{
        "authorUsername": "chiarina",
        "picturePath": "/images/profilePictures/98c24b06_d68c_449f_8838_7d93cb83a0e8.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": " set the item \"Festival dell'Oriente\" as complete",
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "listTitle": "uscite con bffs",
        "insertionDate": {
          "$date": "2022-04-10T23:13:46.110Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/3.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: 5 items completed!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-03-26T10:26:10.898Z"
        }
      },{
        "authorUsername": "sara",
        "picturePath": "/images/profilePictures/b9de08ac_21ac_4d26_8b30_a6c2a886ef49.png",
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": " added you to the the list \"iSushi\"",
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-06-04T12:45:11.730Z"
        }
      },{
        "authorUsername": "emma",
        "picturePath": null,
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": " joined the list \"iSushi\"",
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-06-04T12:45:15.458Z"
        }
      },{
        "authorUsername": "fede",
        "picturePath": null,
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": " joined the list \"iSushi\"",
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-06-04T12:45:55.994Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/4.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: 10 items completed!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-06-04T14:01:07.506Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/10.png",
        "users": [
          {
            "$oid": "6229c7ba9db0b0bebb8e893f"
          }
        ],
        "text": "Achievement unlocked: you visited the reports page!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2021-12-19T10:49:06.581Z"
        }
      },{
        "authorUsername": null,
        "picturePath": "/images/achievements/10.png",
        "users": [
          {
            "$oid": "6229c8389db0b0bebb8e895c"
          }
        ],
        "text": "Achievement unlocked: you visited the reports page!",
        "listId": null,
        "listTitle": null,
        "insertionDate": {
          "$date": "2022-03-11T10:51:12.852Z"
        }
      }]
);

db.lists.insertMany(
    [{
        "title": "casa",
        "joinCode": null,
        "colorIndex": 0,
        "members": [
          {
            "userId": {
              "$oid": "622b2e93f7be0b944aa3a7dd"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "622b494a181361c7f5d25166"
            }
          },
          {
            "userId": {
              "$oid": "622b2e3ef7be0b944aa3a7d7"
            },
            "username": null,
            "anonymousId": null,
            "role": "member",
            "_id": {
              "$oid": "622b4983181361c7f5d25192"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-01-14T13:06:18.790Z"
        }
      },{
        "title": "cosa portare in valigia",
        "joinCode": null,
        "colorIndex": 1,
        "members": [
          {
            "userId": {
              "$oid": "622b2e93f7be0b944aa3a7dd"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "622b4dca181361c7f5d253ab"
            }
          },
          {
            "userId": {
              "$oid": "622b2e3ef7be0b944aa3a7d7"
            },
            "username": null,
            "anonymousId": null,
            "role": "member",
            "_id": {
              "$oid": "622b4f69181361c7f5d254b0"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-04-11T13:25:30.805Z"
        }
      },{
        "title": "pcd",
        "joinCode": null,
        "colorIndex": 0,
        "members": [
          {
            "userId": {
              "$oid": "6221c8de1e18e4350a7c22b5"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "6221c90e1e18e4350a7c22bd"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-02-22T08:08:46.542Z"
        }
      },{
        "title": "pps",
        "joinCode": null,
        "colorIndex": 1,
        "members": [
          {
            "userId": {
              "$oid": "6221c8de1e18e4350a7c22b5"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "6221ca0b1e18e4350a7c2345"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-02-21T18:12:59.460Z"
        }
      },{
        "title": "exams",
        "joinCode": null,
        "colorIndex": 2,
        "members": [
          {
            "userId": {
              "$oid": "6221c8de1e18e4350a7c22b5"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "6221e5feef1d809a34c39ee4"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-02-01T10:12:14.220Z"
        }
      },{
        "title": "Uscite con bffs",
        "joinCode": "2fgNp4",
        "colorIndex": 1,
        "members": [
          {
            "userId": {
              "$oid": "6229c7ba9db0b0bebb8e893f"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "6229c7f09db0b0bebb8e894a"
            }
          },
          {
            "userId": {
              "$oid": "6229c8389db0b0bebb8e895c"
            },
            "username": null,
            "anonymousId": null,
            "role": "member",
            "_id": {
              "$oid": "6229c99d9fd80e508ca0b272"
            }
          },
          {
            "userId": {
              "$oid": "6229c8b29db0b0bebb8e896c"
            },
            "username": null,
            "anonymousId": null,
            "role": "member",
            "_id": {
              "$oid": "6229ca099fd80e508ca0b2b7"
            }
          }
        ],
        "creationDate": {
          "$date": "2021-12-19T09:42:08.433Z"
        }
      },{
        "title": "Film da vedere assolutamente!!",
        "joinCode": null,
        "colorIndex": 0,
        "members": [
          {
            "userId": {
              "$oid": "6229c7ba9db0b0bebb8e893f"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "6229d0fc9fd80e508ca0b7e0"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-01-10T10:20:44.333Z"
        }
      },{
        "title": "iSushi",
        "joinCode": "O6P3NN",
        "colorIndex": 2,
        "members": [
          {
            "userId": {
              "$oid": "6229c7ba9db0b0bebb8e893f"
            },
            "username": null,
            "anonymousId": null,
            "role": "owner",
            "_id": {
              "$oid": "622b1c59306b101347f917c0"
            }
          },
          {
            "userId": {
              "$oid": "6229c8389db0b0bebb8e895c"
            },
            "username": null,
            "anonymousId": null,
            "role": "member",
            "_id": {
              "$oid": "622b1cbb306b101347f91817"
            }
          },
          {
            "userId": null,
            "username": "emma",
            "anonymousId": "c9366355-8302-44c6-8dc6-50bf398e73a1",
            "role": "member",
            "_id": {
              "$oid": "622b1da5306b101347f9184c"
            }
          },
          {
            "userId": null,
            "username": "fede",
            "anonymousId": "5615f953-945e-4631-a799-28cfab68cd48",
            "role": "member",
            "_id": {
              "$oid": "622b1e13306b101347f9188e"
            }
          }
        ],
        "creationDate": {
          "$date": "2022-06-04T12:44:33.983Z"
        }
      }]
);

db.items.insertMany(
    [{
        "_id": {
          "$oid": "622b49d9181361c7f5d251d5"
        },
        "listId": {
          "$oid": "622b494a181361c7f5d25165"
        },
        "title": "assicurazione",
        "dueDate": {
          "$date": "2022-02-14T22:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-02-14T13:16:56.450Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": true,
        "creationDate": {
          "$date": "2022-01-15T13:08:41.061Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b494a181361c7f5d25166"
            },
            "count": 1,
            "_id": {
              "$oid": "622b4cc9181361c7f5d252dc"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b4c1a181361c7f5d25298"
        },
        "listId": {
          "$oid": "622b494a181361c7f5d25165"
        },
        "title": "pagare bollette",
        "dueDate": {
          "$date": "2022-03-28T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-03-11T13:22:27.727Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": true,
        "creationDate": {
          "$date": "2022-03-11T13:18:18.821Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b4983181361c7f5d25192"
            },
            "count": 1,
            "_id": {
              "$oid": "622b4cf9181361c7f5d2532f"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b4e22181361c7f5d2541b"
        },
        "listId": {
          "$oid": "622b4dca181361c7f5d253aa"
        },
        "title": "documenti + passaporto",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 2,
        "remainingCount": 2,
        "priority": true,
        "creationDate": {
          "$date": "2022-04-11T13:26:58.401Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "622b4e6b181361c7f5d25425"
        },
        "listId": {
          "$oid": "622b4dca181361c7f5d253aa"
        },
        "title": "caricatore telefono",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 2,
        "remainingCount": 2,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-11T13:28:11.506Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221c9471e18e4350a7c22d6"
        },
        "listId": {
          "$oid": "6221c90e1e18e4350a7c22bc"
        },
        "title": "assignment #1",
        "dueDate": {
          "$date": "2022-04-11T21:59:59.999Z"
        },
        "reminderDate": {
          "$date": "2022-04-10T18:00:00Z"
        },
        "completionDate": {
          "$date": "2022-04-11T17:24:41.355Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-03-08T08:09:43.135Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221c9501e18e4350a7c22e6"
        },
        "listId": {
          "$oid": "6221c90e1e18e4350a7c22bc"
        },
        "title": "assignment #2",
        "dueDate": {
          "$date": "2022-05-09T21:59:59.999Z"
        },
        "reminderDate": {
          "$date": "2022-05-09T18:00:00Z"
        },
        "completionDate": {
          "$date": "2022-05-09T20:09:42.349Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-04-12T17:23:52.558Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221c95a1e18e4350a7c22f0"
        },
        "listId": {
          "$oid": "6221c90e1e18e4350a7c22bc"
        },
        "title": "assignment #3",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [
          {
            "title": "no deadline",
            "colorIndex": 0,
            "_id": {
              "$oid": "6221c9e11e18e4350a7c232a"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-05-24T08:10:02.134Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221caf71e18e4350a7c239a"
        },
        "listId": {
          "$oid": "6221ca0b1e18e4350a7c2344"
        },
        "title": "lab-3 streams",
        "dueDate": {
          "$date": "2022-03-23T22:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-03-24T23:24:48.585Z"
        },
        "tags": [
          {
            "title": "soft deadline",
            "colorIndex": 1,
            "_id": {
              "$oid": "6221cc851e18e4350a7c2434"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-03-17T08:16:55.314Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221cb051e18e4350a7c23a4"
        },
        "listId": {
          "$oid": "6221ca0b1e18e4350a7c2344"
        },
        "title": "lab-4 OOP",
        "dueDate": {
          "$date": "2022-03-30T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-03-30T11:24:49.803Z"
        },
        "tags": [
          {
            "title": "soft deadline",
            "colorIndex": 1,
            "_id": {
              "$oid": "6221cc8c1e18e4350a7c243f"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-03-23T19:17:09.540Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221cb211e18e4350a7c23bf"
        },
        "listId": {
          "$oid": "6221ca0b1e18e4350a7c2344"
        },
        "title": "lab-6 advanced scala",
        "dueDate": {
          "$date": "2022-04-20T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": null,
        "tags": [
          {
            "title": "soft deadline",
            "colorIndex": 1,
            "_id": {
              "$oid": "6221cc961e18e4350a7c2455"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-06T10:17:37.690Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221cb2c1e18e4350a7c23c9"
        },
        "listId": {
          "$oid": "6221ca0b1e18e4350a7c2344"
        },
        "title": "lab-10 prolog",
        "dueDate": {
          "$date": "2022-05-18T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-05-23T18:24:55.273Z"
        },
        "tags": [
          {
            "title": "soft deadline",
            "colorIndex": 1,
            "_id": {
              "$oid": "6221cc9c1e18e4350a7c2460"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-21T12:17:48.861Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221cb321e18e4350a7c23d3"
        },
        "listId": {
          "$oid": "6221ca0b1e18e4350a7c2344"
        },
        "title": "lab-11 prolog",
        "dueDate": {
          "$date": "2022-05-25T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": null,
        "tags": [
          {
            "title": "soft deadline",
            "colorIndex": 1,
            "_id": {
              "$oid": "6221cca51e18e4350a7c246b"
            }
          }
        ],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-05-18T23:07:54.984Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221e658ef1d809a34c39ef7"
        },
        "listId": {
          "$oid": "6221e5feef1d809a34c39ee3"
        },
        "title": "sistemi informativi (orale)",
        "dueDate": {
          "$date": "2022-03-04T22:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-03-04T16:13:54.499Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-02-10T10:13:44.365Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221e745ef1d809a34c39f53"
        },
        "listId": {
          "$oid": "6221e5feef1d809a34c39ee3"
        },
        "title": "LCMC (orale)",
        "dueDate": {
          "$date": "2022-05-05T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-05-05T16:18:37.340Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-04-17T10:17:41.027Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221e766ef1d809a34c39f64"
        },
        "listId": {
          "$oid": "6221e5feef1d809a34c39ee3"
        },
        "title": "sicurezza delle reti (scritto)",
        "dueDate": {
          "$date": "2022-06-27T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-05-24T10:18:14.498Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6221e7adef1d809a34c3a006"
        },
        "listId": {
          "$oid": "6221e5feef1d809a34c39ee3"
        },
        "title": "business intelligence (scritto)",
        "dueDate": {
          "$date": "2022-07-11T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": true,
        "creationDate": {
          "$date": "2022-06-04T10:19:25.572Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229cc419fd80e508ca0b374"
        },
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "title": "Mostra Real Bodies",
        "dueDate": {
          "$date": "2022-01-08T22:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2021-01-08T21:05:00.259Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2021-12-28T10:00:33.366Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229cd8e9fd80e508ca0b432"
        },
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "title": "Mostra Essere Umane",
        "dueDate": {
          "$date": "2022-02-19T22:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-02-19T19:11:55.870Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-01-31T10:06:06.406Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229cf389fd80e508ca0b5d8"
        },
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "title": "Festival dell'Oriente",
        "dueDate": {
          "$date": "2022-04-10T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-04-10T23:13:46.110Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-03-10T10:13:12.843Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229cffd9fd80e508ca0b6b2"
        },
        "listId": {
          "$oid": "6229c7f09db0b0bebb8e8949"
        },
        "title": "Artevento - Festival Acquiloni",
        "dueDate": {
          "$date": "2022-06-30T21:59:59.999Z"
        },
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-30T10:16:29.126Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229d1839fd80e508ca0b7fd"
        },
        "listId": {
          "$oid": "6229d0fc9fd80e508ca0b7df"
        },
        "title": "Dune",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-02-26T10:25:46.373Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-01-10T10:22:59.488Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229d1c09fd80e508ca0b811"
        },
        "listId": {
          "$oid": "6229d0fc9fd80e508ca0b7df"
        },
        "title": "West Side Story",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-03-26T10:26:10.898Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-03-10T10:24:00.952Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229d2119fd80e508ca0b81b"
        },
        "listId": {
          "$oid": "6229d0fc9fd80e508ca0b7df"
        },
        "title": "Crazy Rich Asians",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-03-10T10:25:21.356Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "6229d2239fd80e508ca0b82f"
        },
        "listId": {
          "$oid": "6229d0fc9fd80e508ca0b7df"
        },
        "title": "Luca",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 1,
        "remainingCount": 1,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-25T10:25:39.169Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "622b1fba306b101347f918ec"
        },
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "title": "11B - involtini gamberi",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-06-04T13:32:23.463Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": false,
        "creationDate": {
          "$date": "2022-06-04T12:57:58.654Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b1c59306b101347f917c0"
            },
            "count": 1,
            "_id": {
              "$oid": "622b2000306b101347f91909"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b2066306b101347f91a09"
        },
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "title": "17B - ravioli misto",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-06-04T13:35:37.219Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": false,
        "creationDate": {
          "$date": "2022-06-04T13:01:50.089Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b1e13306b101347f9188e"
            },
            "count": 1,
            "_id": {
              "$oid": "622b206d306b101347f91a5c"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b20ee306b101347f91b9a"
        },
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "title": "86 - osomaki nido",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-06-04T13:49:53.475Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": false,
        "creationDate": {
          "$date": "2022-06-04T13:04:06.621Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b1cbb306b101347f91817"
            },
            "count": 1,
            "_id": {
              "$oid": "622b20fc306b101347f91c17"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b211b306b101347f91ca9"
        },
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "title": "89 - futomaki misto",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-06-04T13:48:47.280Z"
        },
        "tags": [],
        "count": 1,
        "remainingCount": 0,
        "priority": false,
        "creationDate": {
          "$date": "2022-06-04T13:07:51.310Z"
        },
        "assignees": [
          {
            "memberId": {
              "$oid": "622b1da5306b101347f9184c"
            },
            "count": 1,
            "_id": {
              "$oid": "622b2121306b101347f91d3e"
            }
          }
        ]
      },{
        "_id": {
          "$oid": "622b21a2306b101347f91f39"
        },
        "listId": {
          "$oid": "622b1c59306b101347f917bf"
        },
        "title": "118 - sashimi sake",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": {
          "$date": "2022-06-04T13:52:58.526Z"
        },
        "tags": [
          {
            "title": "da condividere",
            "colorIndex": 3,
            "_id": {
              "$oid": "622b21f6306b101347f924ca"
            }
          }
        ],
        "count": 3,
        "remainingCount": 3,
        "priority": false,
        "creationDate": {
          "$date": "2022-06-04T13:09:06.427Z"
        },
        "assignees": []
      },{
        "_id": {
          "$oid": "622c7a751f7d40939c667ce0"
        },
        "listId": {
          "$oid": "622b4dca181361c7f5d253aa"
        },
        "title": "vestiti",
        "dueDate": null,
        "reminderDate": null,
        "completionDate": null,
        "tags": [],
        "count": 5,
        "remainingCount": 5,
        "priority": false,
        "creationDate": {
          "$date": "2022-04-11T13:29:58.401Z"
        },
        "assignees": []
      }]
);