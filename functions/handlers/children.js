const { db } = require("../util/admin");

exports.getChild = (req, res) => {
  let childData = {};
  db.collection("children")
    .where("userHandle", "==", req.user.handle)
    .where("name", "==", req.params.childName)
    .get()
    .then((data) => {
      let childData = {};
      data.forEach((doc) => {
        childData = doc.data();
        childData.id = doc.id;
      });
      return res.json(childData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getChildren = (req, res) => {
  db.collection("children")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then((data) => {
      let children = [];
      let childData = {};
      data.forEach((doc) => {
        childData = doc.data();
        childData.id = doc.id;
        children.push(childData);
      });
      return res.json(children);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.addChild = (req, res) => {
  const newChild = {
    ...req.body,
    userHandle: req.user.handle,
    nurseryName: "-",
    score: {
      DSPM: {
        parent: {
          GM: 0,
          FM: 0,
          RL: 0,
          EL: 0,
          PS: 0,
        },
        nursery: {
          GM: 0,
          FM: 0,
          RL: 0,
          EL: 0,
          PS: 0,
        },
      },
    },
    assessmentResult: [],
    createdAt: new Date().toISOString(),
    imageUrl: "",
  };
  db.collection("children")
    .add(newChild)
    .then((doc) => {
      const resChild = newChild;
      resChild.id = doc.id;
      res.json(resChild);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.updateScoreChild = (req, res) => {
  const childId = req.params.childId;
  const scoreType = req.params.scoreType;
  const userType = req.user.type;
  const newScore = req.body;
  switch (scoreType) {
    case "DSPM":
      if (userType == "parent") {
        db.doc(`/children/${childId}`)
          .update({
            "score.DSPM.parent": newScore,
          })
          .then((doc) => {
            res.json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
          });
      } else {
        db.doc(`/children/${childId}`)
          .update({
            "score.DSPM.nursery": newScore,
          })
          .then((doc) => {
            res.json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
          });
      }
      break;
    default:
      break;
  }
};
