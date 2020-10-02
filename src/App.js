import React, {useEffect, useState} from 'react';
import {
  useHistory,
  useParams
} from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import Pusher from 'pusher-js';
import {useGetConversations, useQuery} from "./customHooks";
import ConversationList from './components/ConversationList';
import Layout from "./components/Layout";
import ConversationMain from "./components/ConversationMain";

function App() {
  let query = useQuery();
  let { conversationID } = useParams();
  const history = useHistory();
  const [selectedConversation, setSelectedConversation] = useState(false);
  const [filter, setFilter] = useState('open');
  const queryFilter = query.get('filter') ? query.get('filter') : 'open';

  const {data, isLoading, isError} = useGetConversations();

  useEffect(() => {
    setFilter(queryFilter);
  }, [queryFilter]);

  useEffect(() => {
    // connect to pusher
    // set up pusher
    Pusher.logToConsole = true;
    const pusher = new Pusher('66e7f1b4416d81db9385', {
      cluster: 'us3'
    });

    // subscribe to inbox notifications
    let channel = pusher.subscribe('inbox-notifications');

    // new conversation notifications
    channel.bind('new-conversation', function(data) {
      history.push('/conversation/' + data.id + '?filter=open');
    });
  }, []);

  useEffect(() => {
    setSelectedConversation(conversationID);
  }, [conversationID]);

  useEffect(() => {
    if (! selectedConversation) {
      return;
    }

  }, [selectedConversation]);

  return (
    <SnackbarProvider maxSnack={3}>
      {console.count('app')}

      <Layout>
        <ConversationList conversationsLoading={isLoading} conversations={data} setFilter={setFilter} filter={queryFilter} selectedConversation={selectedConversation} />
        <ConversationMain conversations={data} selectedConversation={selectedConversation} />
      </Layout>
    </SnackbarProvider>
  );
}

export default App;
