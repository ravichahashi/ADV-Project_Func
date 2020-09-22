const { admin, db } = require("../util/admin");

const config = require("../util/config");
const { uuid } = require("uuidv4");

const firebase = require("firebase");
firebase.initializeApp(config);

exports.getChildrenDetails = (req, res) => {
  let childrenData = {};
  db.doc(`/Children/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        childrenData.Children = doc.data();
        return db
          .collection("Children")
          .where("childrenHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ errror: "Children not found" });
      }
    })
    .then((data) => {
      childrenData.Children = [];
      data.forEach((doc) => {
        childrenData.Children.push({
          name: doc.data().name,
          //   date: doc.data().date of birth,
          weight: doc.data().weight,
          high: doc.data().high,
          nursid: doc.data().nursID,
          userid: doc.data().userID,
          score: doc.data().score,
          childrenId: doc.id,
        });
      });
      return res.json(childrenData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
