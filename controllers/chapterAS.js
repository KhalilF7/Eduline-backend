var createError = require("http-errors");
const ChapterAS = require("../models/chapterAS");
const CourseAs = require("../models/courseAS");

exports.create = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    console.log(req.params.body)
    const chapterAS = new ChapterAS({
      Name:req.body.Name,
      Description:req.body.Description,
      Lien:req.body.Lien
    });
    console.log(chapterAS)
    chapterAS.save(chapterAS)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occured while creating a create operation",
      });
    });
    

};
module.exports.ChapterASList = async (req, res) => {
  ChapterAS.find(function(err, data) {
      if(err){
          console.log(err);
      }
      else{
          res.send(data);
      }
  });  
};
module.exports.ChaptersASFindOne = async (req, res) => {
  const id=req.params.id;
  ChapterAS.findById(id).then((data) => {
        res.send(data);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
module.exports.ChaptersASDel = async (req, res) => {
  const id=req.params.id;
  ChapterAS.findByIdAndDelete(id).then((data) => {
     
        if (!data){
          res.status(404).send({message:'connot delete with ${id}'})
        }else {
          res.send({
            message:'del success'
          })
        }
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
exports.ChaptersASUpdate = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  const chapterAS = new ChapterAS({
    Name:req.body.Name,
    Description:req.body.Description,
    Lien:req.body.Lien,
    _id:id
  });
  ChapterAS.findByIdAndUpdate(id, chapterAS, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update DomainAS with id=${id}. Maybe DomainAS was not found!`
        });
      } else res.send(domainAS);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DomainAS with id=" + id
      });
    });
};
module.exports.ChapterASListByC = async (req, res) => {
  try {
  const id=req.params.id;
  const cr =await CourseAs.findById(id);
  var tab=new Array()
  for (let i = 0; i < cr.Chapter.length; i++) {
   
    tab[i]= await ChapterAS.findById(cr.Chapter[i]);
  }
     
          res.send(tab);
     
  }
  catch(err) {
    res.status(500).send({
      message:
        err.message 
    });
  }  
};