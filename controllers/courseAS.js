var createError = require("http-errors");
const CourseAS = require("../models/courseAS");
const user = require("../models/user");
const img =require('../controllers/img');
const ChapterAS = require("../models/chapterAS");
exports.create = async (req, res) => {
  // const image =await img.uploadImg(a);
  // const chapterAS = new ChapterAS({
  //   Name:req.body.ChName,
  //   Description:req.body.ChDescription,
  //   Lien:req.body.Lien
  // });
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const courseAS = new CourseAS({
      Name:req.body.Name,
      Description:req.body.Description,
      Domain:req.params.idDomain,
      Chapter:req.params.idChapter,
      image:req.params.img
    });
    courseAS.save(courseAS)
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
module.exports.CoursesASList = async (req, res) => {
  CourseAS.find(function(err, data) {
      if(err){
          console.log(err);
      }
      else{
          res.send(data);
      }
  });  
};
module.exports.CoursesASListByIdDomain = async (req, res) => {
  const id=req.params.id;
  console.log(id)
  CourseAS.find({Domain:id}).then((data) => {
     
          res.send(data);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
module.exports.CoursesASFindOne = async (req, res) => {
  const id=req.params.id;
  CourseAS.findById(id).then((data) => {
     
          res.send(data);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};

module.exports.CoursesASDel = async (req, res) => {
  const id=req.params.id;
  const cr = await CourseAS.findOne({_id:id});
  console.log(cr)
  for (let i = 0; i < cr.Chapter.length; i++) {
   
   await ChapterAS.findByIdAndDelete(cr.Chapter[i]);
}
  CourseAS.findByIdAndDelete(id).then((data) => {
     
    
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
exports.CoursesASUpdate = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  const courseAS = new CourseAS({
    Name:req.body.Name,
    Description:req.body.Description,
    Domain:req.body.Domain,
    Chapter:req.body.Chapter,
    _id:id
  });

  CourseAS.findByIdAndUpdate(id, courseAS, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update CourseAS with id=${id}. Maybe CourseAS was not found!`
        });
      } else res.send(courseAS);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating CourseAS with id=" + id
      });
    });
};
module.exports.addTolist = async (req, res) => {
  console.log(req.params.idCor+' '+req.params.idCh)
  const domain = await CourseAS.findByIdAndUpdate(req.params.idCor,{ $push: { Chapter: req.params.idCh }})
  
  CourseAS.findById(req.params.idCor).then((data) => {
     
          res.send(data.Chapter);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};