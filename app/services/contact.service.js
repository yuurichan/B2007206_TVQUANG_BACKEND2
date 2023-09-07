const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    // Define methods to access the DB using mongodb's APIs
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        // Remove undefined fields
        Object.keys(contact).forEach((key) => {
            return contact[key] === undefined && delete contact[key]
        });
        // Nếu không có {} thì js sẽ tự hiểu và gọi return
        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter){
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        })
    }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result
    }

    async deleteAll() {
        const result =  await this.Contact.deleteMany({});
        return result.deletedCount;
    }
    
    async findFavorite() {
        return await this.find({favorite: true});
    }
}

module.exports = ContactService;