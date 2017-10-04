import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Function returning object that encapsulates single Contact */
function Contact(name, email, phone) {
  return {
    name: name,
    email: [].concat([email]),
    phone: [].concat([phone]),

    addEmail : function (new_email) {
      this.email = this.email.concat([new_email]);
    },

    addPhone : function (new_phone) {
      this.phone = this.phone.concat([new_phone]);
    }
  };
}

/* Rendering single contact card */
class ContactCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    event.preventDefault();

    /* Callback to App client delete handler function */
    this.props.onContactDelete(this.props.name,
                               this.props.email,
                               this.props.phone);
  }

  render() {
    return (
      <div className="ContactCard">
        <div className="ContactData">
          Name:{this.props.name}
          <br/>
          Email:{this.props.email}
          <br/>
          Phone:{this.props.phone}
        </div>
        <div className="DeleteContact">
          <button onClick={this.handleClick}>X</button>
        </div>
      </div>
    );
  }
}

class AddNewContact extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clearFormInputs() {
    this.refs.name.value = "";
    this.refs.email.value = "";
    this.refs.phone.value = "";
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.refs.name.value;
    var email = this.refs.email.value;
    var phone = this.refs.phone.value;

    /* Check if phone number is actually a number */
    if (!Number.isInteger(parseInt(phone, 10))) {
      alert("Phone number must be an integer!");
    } else {
      /* Send new contact data to App */
      this.props.handleNewContact(name, email, parseInt(phone, 10));
    }

    /* Reset input fields after reading the values */
    this.clearFormInputs();
  }

  render() {
    return (
      <div className='new-contact'>
        Add new contact
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" ref="name" placeholder="Name" className='contact-input'/>
            <br/>
            <input type="text" ref="email" placeholder="Email address" className='contact-input'/>
            <br/>
            <input type="text" ref="phone" placeholder="Phone number" className='contact-input'/>
          </label>
          <br/>
          <input type="submit" value="Add" className='addButton' />
        </form>
      </div>
    );
  }
}

class FilterContact extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.props.handleFilterContact(this.refs.name.value);
  }

  render() {
    return (
      <div className='filter-contact'>
        Filter contact
        <form>
          <input
            type="text"
            ref="name"
            placeholder="Filter by name"
            className='contact-input'
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}

/* Main App class */
class MyApp extends React.Component {
  constructor() {
    super();
    this.state = {
      contacts : [],
      filter : ""
    }
    this.handleNewContact = this.handleNewContact.bind(this);
    this.handleContactDelete = this.handleContactDelete.bind(this);
    this.handleFilterContact = this.handleFilterContact.bind(this);
  }

  handleNewContact(name, email, phone) {
    const c = new Contact(name, email, phone);
    const contacts = this.state.contacts.concat([c]);

    this.setState({
      contacts: contacts
    });
  }

  handleContactDelete(name, email, phone) {
    const contacts = this.state.contacts.filter(function(contact) {
      return (contact.name !== name &&
              contact.email !== email &&
              contact.phone !== phone);
    });

    this.setState({
      contacts: contacts
    });
  }

  handleFilterContact(filterVal) {
    this.setState({
      filter: filterVal
    });
  }

  renderContactCards() {
    var filter = this.state.filter;

    var contacts = this.state.contacts.filter(function(c){
      return c.name.includes(filter);
    }).map(function(c) {
      return (<ContactCard
                name={c.name}
                email={c.email}
                phone={c.phone}
                onContactDelete={this.handleContactDelete}
                key={c.email}
              />);
    }, this);

    if (contacts.length === 0) {
      contacts = "There are no contacts.";
    }

    return (
      <div>
        {contacts}
      </div>
    );
  }

  render() {
    const contactCards = this.renderContactCards();

    return (
      <div className="myApp">
        <h1>Contact List App</h1>
        <div className='contact-forms'>
          <AddNewContact
            handleNewContact={this.handleNewContact}
          />
          <FilterContact
            handleFilterContact={this.handleFilterContact}
          />
        </div>

        <div className="contacts-list">
          Contacts:
          {contactCards}
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <MyApp />,
  document.getElementById('root')
);
