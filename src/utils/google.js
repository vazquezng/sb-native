import firebase from 'firebase';
import { GoogleSignin } from 'react-native-google-signin';
import googleKeys from '../constants/config/googleKeys';


export default class GoogleService {
  static async signIn() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure(googleKeys);
      const { idToken } = await GoogleSignin.signIn();

      const provider = firebase.auth.GoogleAuthProvider;
      const credential = provider.credential(idToken);

      const data = await firebase.auth().signInWithCredential(credential);
      console.log(data);
      const user = {
        email: data.email,
        photoURL: data.photoURL,
        name: data.displayName,
        first_name: data.displayName.split(' ')[0],
        last_name: data.displayName.split(' ')[1] || '',
        id: data.uid,
        accessToken: data.getToken().za,
      };

      return user;
    } catch (err) {
      console.log(`There was an error in google signIn : ${err}`)
    }
  }
}
