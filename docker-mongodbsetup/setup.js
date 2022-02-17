const cfg = {
    "_id": "rs",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "mongodb1:27017",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "mongodb2:27017",
            "priority": 0
        },
        {
            "_id": 2,
            "host": "mongodb3:27017",
            "priority": 0
        }
    ],
    settings: {
        chainingAllowed: true
    }
};
rs.initiate(cfg, { force: true });
rs.reconfig(cfg, { force: true });
