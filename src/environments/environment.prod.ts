interface FirebaseInterface {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

const firebase: FirebaseInterface =  {
  apiKey: 'AIzaSyDVGoc4JF1Jw0-PGVY6_mOPGlJkhkFWk2Y',
  authDomain: 'fcc-night.firebaseapp.com',
  databaseURL: 'https://fcc-night.firebaseio.com',
  projectId: 'fcc-night',
  storageBucket: 'fcc-night.appspot.com',
  messagingSenderId: '1019062685394'
};

export const environment = {
  production: true,
  firebase,
  apiUrl: 'http://localhost:3000/api/v1'
};
