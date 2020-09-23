const { db } = require("../util/admin");

exports.getQuestions = (req, res) => {
  db.collection("questions")
    .get()
    .then((data) => {
      let question = [];
      let questionData = {};
      data.forEach((doc) => {
        questionData = doc.data();
        questionData.questionId = doc.id;
        question.push(questionData);
      });
      return res.json(question);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getQuestion = (req, res) => {
  db.collection("questions")
    .where("month", "==", req.params.month)
    .get()
    .then((data) => {
      let question = [];
      let questionData = {};
      data.forEach((doc) => {
        questionData = doc.data();
        questionData.questionId = doc.id;
        question.push(questionData);
      });
      return res.json(question);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postQuestions = (req, res) => {
  const data = req.body;
  data.forEach((newQuestion) => {
    db.collection("questions")
      .add(newQuestion)
      .then((doc) => {
        const resQuestion = newQuestion;
        resQuestion.questionId = doc.id;
        res.json(resQuestion);
      })
      .catch((err) => {
        res.status(500).json({ error: "something went wrong" });
        console.error(err);
      });
  });
};

exports.getAssessment = (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    const newQuestion = {
      video: req.body[i].video,
      tag: req.body[i].tag,
      text: req.body[i].text,
      guide: req.body[i].guide,
      tool: req.body[i].tool,
    };

    db.collection("questions")
      .add(newQuestion)
      .then((doc) => {
        const resQuestion = newQuestion;
        resQuestion.questionId = doc.id;
        res.json(resQuestion);
      })
      .catch((err) => {
        res.status(500).json({ error: err.code });
        console.error(err);
      });
  }
};
