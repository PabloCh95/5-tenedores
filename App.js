import React, {useEffect} from 'react';
import {YellowBox} from 'react-native';
import { firebaseApp } from "./src/utils/firebase";
import * as firebase from 'firebase';
import Navigation from "./src/navigation/Navigation";
import { decode, encode } from 'base-64';

YellowBox.ignoreWarnings(["Setting a timer"]);//esto quita el warrning de la vista de la app

if(!global.btoa) global.btoa=encode;
if(!global.atob) global.atob=decode;

export default function App() {
  return <Navigation/>;
}
