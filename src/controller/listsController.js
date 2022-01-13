const List = require("../model/listModel").createListModel();

function createList(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.create({
        title: request.body.title,
        isVisible: request.body.isVisible,
        colorIndex: request.body.colorIndex,
        members: [{
            userId,
            role: "owner"
        }]
    })
    .then(list => response.json(list), error => response.status(500).send(error));
}

function deleteList(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.findOneAndDelete({ _id: request.params.id, members: { $elemMatch: { userId, role: "owner" } } })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                response.sendStatus(404);
                return;
            }
            response.send();
        })
        .catch(error => response.status(500).send(error));
}

function getList(request, response) {
    const userId = request.session.userId;
    List.findOne({
        _id: request.params.id,
        members: { $elemMatch: { $or: [ { userId }, { anonymousId: request.body.userId } ] } }
    })
    .exec()
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

function getUserLists(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.find({ members: { $elemMatch: { userId } } })
        .exec()
        .then(lists => response.json(lists), error => response.status(500).send(error));
}

function updateTitle(request, response) {
    const userId = request.session.userId;
    List.findOneAndUpdate(
        {
            _id: request.params.id,
            members: { $elemMatch: { $or: [ { userId }, { anonymousId: request.body.userId } ] } }
        },
        { $set: { title: request.body.title } },
        { runValidators: true, new: true }
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

function updateVisibility(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.findOneAndUpdate(
        { _id: request.params.id, members: { $elemMatch: { userId, role: "owner" } } },
        request.body.isVisible ? { $set: { joinCode: uuid.v4() } } : { $set: { joinCode: null } },
        { runValidators: true, new: true }
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

function updateColorIndex(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.findOneAndUpdate(
        {
            _id: request.params.id,
            members: { $elemMatch: { $or: [ { userId }, { anonymousId: request.body.userId } ] } }
        },
        { $set: { colorIndex: request.body.colorIndex } },
        { runValidators: true, new: true }
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

function addMember(request, response) {
    const userId = request.session.userId;
    (
        userId !== undefined
        ? List.findOneAndUpdate(
            { _id: request.params.id, members: { $elemMatch: { userId, role: "owner" } } },
            {
                $push: {
                    members: {
                        userId: request.body.userId,
                        role: "member"
                    }
                }
            },
            { runValidators: true, new: true }
          )
          .exec()
        : List.findOneAndUpdate(
            { _id: request.params.id, joinCode: request.body.joinCode },
            {
                $push: {
                    members: {
                        anonymousId: request.body.userId,
                        role: "member"
                    }
                }
            },
            { runValidators: true, new: true }
          )
          .exec()
    )
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

function removeMember(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    const memberId = request.params.memberId;
    (
        userId === memberId
        ? List.findByIdAndUpdate(
            request.params.id,
            { $pull: { members: { _id: memberId } } },
            { runValidators: true, new: true }
          )
          .exec()
        : List.findOneAndUpdate(
            { _id: request.params.id, members: { $elemMatch: { userId, role: "owner" } } },
            { $pull: { members: { _id: memberId } } },
            { runValidators: true, new: true }
        ).exec()
    )
    .then(
        list => {
            if (list === null) {
                response.sendStatus(404);
                return;
            }
            response.json(list);
        },
        error => response.status(500).send(error)
    );
}

module.exports = {
    createList,
    deleteList,
    getList,
    getUserLists,
    updateTitle,
    updateVisibility,
    updateColorIndex,
    addMember,
    removeMember
}
