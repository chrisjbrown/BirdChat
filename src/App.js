import React, { Component } from 'react';
import {
  Button,
  Icon,
  Container,
  Input,
  Segment,
  Menu
} from 'semantic-ui-react';
import moment from 'moment';

import { subscribeToMessages, sendMessage } from './api';
import Message from './components/message';
import TextArea from './components/textarea';

const phoneRegex = /^\d{10}$/;

class App extends Component {

  constructor(props) {
    super(props);

    /**
     * listen for confirmation our message was sent
     * and for new messages from recipient
     */
    subscribeToMessages((err, message) => {
      const messages = this.state.messages;
      messages.push(message);
      return this.setState({
        messages: messages
      });
    });

    this.state = {
      composer: '',
      recipientPhone: '',
      recipientPhoneConfirmed: false,
      invalidPhone: false,
      messages: []
    };
  }

  /**
   * loop and output all messages so far
   */
  renderMessages() {
    const {messages} = this.state;

    if (messages.length === 0) {
      return (
        <div>
          <div>
            <Icon name="comment outline" size="massive"/>
          </div>
          Send your first message!
        </div>
      )
    }
    
    return messages.map((message, index) => {
      const originatorIsYou = message.originator === process.env.REACT_APP_VMN;
      const dateTime = moment().calendar(message.date);
      return (
        <Message
          key={message.id || index}
          originatorIsYou={originatorIsYou}
          date={dateTime}
          message={message.body}
        />
      );
    });
  }

  /**
   * send message to server to send to recipient
   */
  send = (e) => {
    const {recipientPhone, composer} = this.state;
    e.preventDefault();

    /**
     * construct new message object
     */
    const newMessage = {
      originator: process.env.REACT_APP_VMN,
      recipients: [recipientPhone],
      body: composer
    };

    /**
     * send message to server, reset composer state
     */
    sendMessage(newMessage);
    this.setState({
      composer: ''
    });
  }

  /**
   * keep value of composer up to date in state
   */
  updateMessage = (event) => {
    this.setState({
      composer: event.currentTarget.value
    });
  }

  /**
   * keep recipient phone # up to date in state
   */
  updateRecipientPhone = (event) => {
    /**
     * TODO: some validation of the phone while typing
     */
    const invalidPhone = phoneRegex.test(event.currentTarget.value);
    this.setState({
      invalidPhone: !invalidPhone,
      recipientPhone: event.currentTarget.value
    });
  }

  /**
   * confirms phone # and moves to next step
   */
  confirmRecipientPhone = (event) => {
    event.preventDefault();
    /**
     * TODO: some validation of the phone before confirming
     */
    if (this.state.invalidPhone) {
      return;
    }

    this.setState({
      recipientPhoneConfirmed: true
    });
  }

  renderRecipientForm() {
    const {recipientPhone, invalidPhone} = this.state;
    return (
      <form onSubmit={this.confirmRecipientPhone}>
        <div className="m2">
          <h2>To get started enter a phone number to send SMS too</h2>
        </div>
        <div className="m2">
          <h5>
            Enter a 10 digit dutch number starting with country code
          </h5>
          <Input
            error={invalidPhone}
            value={recipientPhone}
            placeholder="Enter a phone number"
            onChange={this.updateRecipientPhone}
          />
        </div>
        <div className="m2">
          <Button primary type="submit">Submit</Button>
        </div>
      </form>
    );
  }

  renderChat() {
    const {composer} = this.state;

    return (
      <div>
        <div>
          <ol className="list-reset">
            {this.renderMessages()}
          </ol>
        </div>
        <form onSubmit={this.send}>
          <TextArea
            placeholder="Type your message here"
            full={true}
            value={composer}
            onChange={this.updateMessage}
          />
          <div className="right">
            <Button primary type="submit">Send!</Button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    const {recipientPhoneConfirmed} = this.state;

    /**
     * if user hasn't entered a recipient render phone form otherwise render chat
     */
    return (
      <div>
        <Segment>
          <Menu.Item name='home'>
            <Icon size="large" name='home' />
            Bird Chat
          </Menu.Item>
        </Segment>
        <Container textAlign="center">
          {recipientPhoneConfirmed ? this.renderChat() : this.renderRecipientForm()}
        </Container>
      </div>
    );
  }
}

export default App;