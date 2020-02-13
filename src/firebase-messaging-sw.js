importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '12345678920' // add your own messagingSenderId from firebase config
});

const messaging = firebase.messaging();
