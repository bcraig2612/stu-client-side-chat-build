import React, {useEffect, useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import Pusher from 'pusher-js';
import {getClientid, useGetConversations, useQuery} from "./customHooks";
import ConversationList from './components/ConversationList';
import Layout from "./components/Layout";
import ConversationMain from "./components/ConversationMain";
import {mutate} from "swr";
import newConversationMP3 from "./new-conversation.mp3";
import notificationMP3 from "./notification.mp3";
// import * as PusherPushNotifications from "@pusher/push-notifications-web";
//
// const beamsClient = new PusherPushNotifications.Client({
//   instanceId: '3691a62b-d336-4d69-b158-c9bc29b5d8ec',
// });

function unlockAudio() {
  const sound = new Audio(newConversationMP3);
  sound.play().catch((err) => {
    console.log(err);
  });
  sound.pause();
  sound.currentTime = 0;

  document.body.removeEventListener('click', unlockAudio)
  document.body.removeEventListener('touchstart', unlockAudio)
}

function App() {
  let query = useQuery();
  let { conversationID } = useParams();
  const history = useHistory();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileConversationListOpen, setMobileConversationListOpen] = useState(true);
  const [filter, setFilter] = useState('open');
  const queryFilter = query.get('filter') ? query.get('filter') : 'open';

  const {data, isLoading, isError} = useGetConversations(filter);
  const clientid = getClientid();
  
  useEffect(() => {
    setFilter(queryFilter);
  }, [queryFilter]);

  useEffect(() => {
    // beamsClient.start()
    //   .then(() => beamsClient.addDeviceInterest('hello'))
    //   .then(() => console.log('Successfully registered and subscribed!'))
    //   .catch(console.error);
    // play alert sound
    document.body.addEventListener('click', unlockAudio);
    document.body.addEventListener('touchstart', unlockAudio);

    function newMessageAlert(conversationAlert) {
      let audio;
      if (conversationAlert) {
        audio = new Audio(newConversationMP3);
      } else {
        audio = new Audio(notificationMP3);
      }
      audio.play().catch((err) => {
        console.log(err);
      });
    }

    Pusher.logToConsole = true;
    const pusher = new Pusher('a3105b52df63262dc19e', {
      cluster: 'us3'
    });

    if (conversationID) {
      setSelectedConversation(conversationID);
    }

    // subscribe to inbox notifications
    let channel = pusher.subscribe('inbox-notifications-' + clientid);

    // new conversation notifications
    channel.bind('new-conversation', function(data) {
      history.push('/conversation/' + data.id + '?filter=open');
      setSelectedConversation(data.id);
      newMessageAlert(true);
    });

    channel.bind('new-message', function(data) {
      mutate('unreadMessageCount/');
      mutate('conversations/?filter=open');
      newMessageAlert(false);
    });
  }, []);

  useEffect(() => {
    setSelectedConversation(conversationID);
  }, [conversationID]);

  useEffect(() => {
    if (! selectedConversation) {
      return;
    }
    mutate('unreadMessageCount/');
    mutate('conversations/?filter=open');
    setMobileConversationListOpen(false);
  }, [selectedConversation]);

  let content = (
    <React.Fragment>
      <ConversationList errorLoadingConversation={isError} setMobileConversationListOpen={() => setMobileConversationListOpen(false)} mobileConversationListOpen={mobileConversationListOpen} conversationsLoading={isLoading} conversations={data} setFilter={setFilter} filter={queryFilter} selectedConversation={selectedConversation} />
      <ConversationMain setMobileConversationListOpen={() => setMobileConversationListOpen(true)} conversations={data} selectedConversation={selectedConversation} />
    </React.Fragment>
  );

  return (
    <SnackbarProvider maxSnack={1}>
      <Layout>
        {content}
      </Layout>
    </SnackbarProvider>
  );
}

export default App;
