import { FirebaseApp, initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA5RTB9884v4aCF-SumhIDUqoWKJ-OUmfg',
  authDomain: 'eangkot.firebaseapp.com',
  databaseURL:
    'https://eangkot-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'eangkot',
  storageBucket: 'eangkot.appspot.com',
  messagingSenderId: '660669459822',
  appId: '1:660669459822:web:3c56d89da7da5fadb4257f',
  measurementId: 'G-DLCMNHQ5MN',
}

const app: FirebaseApp = initializeApp(firebaseConfig)
export const db: Firestore = getFirestore(app)
