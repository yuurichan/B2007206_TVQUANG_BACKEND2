const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, `An error occured while creating the contact. Error: '${error}'`));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        }
        else {
            documents = await contactService.find({});
        }
    }
    catch (error) {
        return next(new ApiError(500, `An error occured while creating the contact. Error: '${error}'`));
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found")); 
        }
        return res.send(document)
    }
    catch (error) {
        return next(new ApiError(500, `An error has occurred while retrieving contact with ID = ${req.params.id}`))
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact to update not found"));
        }
        else{
            return res.send({message: "Contact has been updated successfully"});
        }
    }
    catch (error) {
        return next(new ApiError(500, `Error updating contact with ID = ${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact to delete not found"));
        }
        else {
            return res.send({message: "Contact has been deleted successfully"});
        }
    }
    catch (error) {
        return next(new ApiError(500, `Could not delete contact with ID = ${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({ message: `${deletedCount} contacts were deleted successfully` });
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while trying to remove all contacts"));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents)
    }
    catch (error) {
        return next(new ApiError(500, `An error has occurred while retrieving favorite contacts`))
    }
};

/*const create = ...*/
// module.exports = {
//     create,
//     findAll,
//     findOne,
//     update,
//     deleteAll,
//     findAllFavorite
// }