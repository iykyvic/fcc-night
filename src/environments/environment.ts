// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export interface FirebaseInterface {
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
  production: false,
  firebase,
  apiUrl: 'http://localhost:3000/api/v1'
};
