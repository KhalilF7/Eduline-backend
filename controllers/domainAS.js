var createError = require("http-errors");
const DomainAS = require("../models/domainAS");

exports.create = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const domainAS = new DomainAS({
      Name:req.body.Name,
      Description:req.body.Description,
      image:req.params.img
    });
    console.log(domainAS.Name);
    domainAS.save(domainAS)
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
module.exports.DomainsASList = async (req, res) => {
  DomainAS.find(function(err, data) {
      if(err){
          console.log(err);
      }
      else{
          res.send(data);
      }
  });  
};
module.exports.DomainsASFindOne = async (req, res) => {
  const id=req.params.id;
  DomainAS.findById(id).then((data) => {
     
          res.send(data);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
module.exports.DomainsASgetListC = async (req, res) => {
  const id=req.params.id;
  DomainAS.findById(id).then((data) => {
     
          res.send(data.courseAS);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};
module.exports.addTolist = async (req, res) => {
  const domain = await DomainAS.findByIdAndUpdate(req.params.idD,{ $push: { courseAS: req.params.idC }})
  
  DomainAS.findById(req.params.idD).then((data) => {
     
          res.send(data.courseAS);
     
  }).catch((err) => {
    res.status(500).send({
      message:
        err.message 
    });
  });  
};

module.exports.DomainsASDel = async (req, res) => {
  const id=req.params.id;
  DomainAS.findByIdAndDelete(id).then((data) => {
     
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
exports.DomainsASUpdate = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  const domainAS = new DomainAS({
    Name:req.body.Name,
    Description:req.body.Description,
    Image:req.body.Image,
    _id:id
  });
  DomainAS.findByIdAndUpdate(id, domainAS, { useFindAndModify: false })
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