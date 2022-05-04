var createError = require("http-errors");
const Calendar = require("../models/calendar");

exports.create = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const calendar = new Calendar({
        id_Cour:req.body.id_Cour,
        id_User:req.body.id_User,
        Description:req.body.Description,
        Title:req.body.Title
      
    });
    calendar.save(calendar)
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
module.exports.CalendarList = async (req, res) => {
    Calendar.find(function(err, data) {
      if(err){
          console.log(err);
      }
      else{
          res.send(data);
      }
  });  
};
module.exports.CalendarFindOne = async (req, res) => {
  const id=req.params.id;
  Calendar.findById(id).then((data) => {
        res.send(data);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
module.exports.CalendarDel = async (req, res) => {
  const id=req.params.id;
  Calendar.findByIdAndDelete(id).then((data) => {
     
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
exports.CalendarUpdate = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  const calendar = new Calendar({
    id_Cour:req.body.id_Cour,
    id_User:req.body.id_User,
    Description:req.body.Description,
    Title:req.body.Title
  });
  Calendar.findByIdAndUpdate(id, calendar, { useFindAndModify: false })
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