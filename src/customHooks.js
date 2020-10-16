import {useLocation} from "react-router-dom";
import useSWR from "swr";

const apiURL = 'https://dev01.sotellus.com/API/chat/';

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function getJWT() {
  localStorage.setItem('stu_jwt', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc290ZWxsdXMuY29tIiwiYXVkIjoiaHR0cHM6XC9cL3NvdGVsbHVzLmNvbSIsImNsaWVudGlkIjoxMjEwLCJpc19jbGllbnRfY29udGFjdCI6MCwiY2hhbm5lbF9uYW1lIjoiY2hhbm5lbF9kZW1vIiwiY2xpZW50X2NvbnRhY3RfaWQiOmZhbHNlLCJleHAiOjE2MDI5MDMxMDR9.QJjYMCrymMd60bz4kvv5ZGR8FTmjuoleY1OQjAv3A4U');
  const token = localStorage.getItem('stu_jwt');
  if (token) {
    // return for use in Authorization header
    return 'Bearer ' + token;
  }
  // if no authorization token then forward to login
  window.location.href = "https://sotellus.com/login";
  return false;
}

export async function requestSendMessage(body, conversationID) {
  const token = getJWT();
  const data = {body: body, conversationID: conversationID};
  return fetch(apiURL + 'messages/', {
    method: "POST",
    withCredentials: true,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  })
}

export async function requestAcceptConversation(conversationID) {
  const token = getJWT();
  const data = {conversationID: conversationID};
  return fetch(apiURL + 'acceptConversation/', {
    method: "POST",
    withCredentials: true,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  })
}

export async function requestUpdateConversation(active, conversationID) {
  const token = getJWT();
  const data = {active: active, conversationID: conversationID};
  return fetch(apiURL + 'conversations/', {
    method: "POST",
    withCredentials: true,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  })
}

export async function requestDeleteConversation(conversationID) {
  const token = getJWT();
  const data = {conversationID: conversationID};
  console.log(data);
  return fetch(apiURL + 'removeConversation/', {
    method: "POST",
    withCredentials: true,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  })
}

export function useGetConversation(id) {
  const token = getJWT();

  const fetcher = async url => {
    const res = await fetch(apiURL + 'messages/?conversationID=' + id, {
      method: "GET",
      withCredentials: true,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }
    return await res.json()
  }


  const { data, error } = useSWR(() => id ? 'messages/?conversationID=' + id : null, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  };
}

export function useGetConversations(filter) {
  const token = getJWT();

  const fetcher = async url => {
    const res = await fetch(apiURL + 'conversations/?filter=' + filter, {
      method: "GET",
      withCredentials: true,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }
    return await res.json()
  }


  const { data, error } = useSWR('conversations/?filter=' + filter, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  };
}