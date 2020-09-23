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
