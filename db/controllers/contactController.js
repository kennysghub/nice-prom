//database functionality here
const Contacts = require('../models/contactModel');
const contactImpl = {};

//add contact
contactImpl.addContactDB = (contact) => {
  console.log(`addContact invoked`)
  Contacts.create(contact)
    .then(() => console.log('contact created'))
    .catch(err => console.log(err))
}

//get contact
contactImpl.getContactDB = (contact) => {
  console.log('in the getContactDB method')
  const k = Contacts.findOne(contact)
    .then((data) => {
      if (data === null) {
        console.log('did not find contact')
      } else {
        console.log('in contactImpl with data: ', data)
        return data
      }
    })
    .catch(err => console.log('error in getting contact'))
  return k;
}

contactImpl.getContactList = async (contact) => {
  console.log('in getcontactlist method')
  try {
    const allContactList = await Contacts.find(contact)
    if (allContactList === null) {
      console.log('cannot find contacts')
    } else {
      return { contacts: allContactList }
    }
  } catch (err) {
    console.log('error in getting all contacts')
    // console.trace('after catch ', allContactList)
  }
}

export default contactImpl;
