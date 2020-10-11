const { db } = require("../util/admin");

exports.getChild = (req, res) => {
  let childData = {};
  db.doc(`/children/${req.params.childId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ errror: "Child not found" });
      }
      childData = doc.data();
      childData.childId = doc.id;
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
        childData.childId = doc.id;
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
  };
  db.collection("children")
    .add(newChild)
    .then((doc) => {
      const resChild = newChild;
      resChild.childId = doc.id;
      res.json(resChild);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
