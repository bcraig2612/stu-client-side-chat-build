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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileConversationListOpen, setMobileConversationListOpen] = useState(true);
  const [filter, setFilter] = useState('open');
  const queryFilter = query.get('filter') ? query.get('filter') : 'open';

  const {data, isLoading, isError} = useGetConversations(filter);

  useEffect(() => {
    setFilter(queryFilter);
  }, [queryFilter]);

  useEffect(() => {
    // connect to pusher
    // set up pusher
    Pusher.logToConsole = true;
    const pusher = new Pusher('a3105b52df63262dc19e', {
      cluster: 'us3'
    });

    if (conversationID) {
      setSelectedConversation(conversationID);
    }

    // subscribe to inbox notifications
    let channel = pusher.subscribe('inbox-notifications');

    // new conversation notifications
    channel.bind('new-conversation', function(data) {
      history.push('/conversation/' + data.id + '?filter=open');
      setSelectedConversation(data.id);
    });
  }, []);

  useEffect(() => {
    setSelectedConversation(conversationID);
  }, [conversationID]);

  useEffect(() => {
    if (! selectedConversation) {
      return;
    }
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
