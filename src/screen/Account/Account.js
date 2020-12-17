import React, { useState, useEffect } from 'react';
import {View,Text} from 'react-native';
//importacion de firebase
import * as firebase from "firebase";
//importacion de componentes
import Loading from "../../components/Loading";
//importacion de screen
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";


export default function account(){
   const [login, setLogin] = useState(null); //USESTATE SIRVE PARA CAMBIAR LOS VALORES DE LA CONSTANTE "LOGIN", SETLOGIN ES UNA FUNCION QUE PERMITE CAMBIAR LOS VALORES DE LOGIN
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true);//SI USER ES TRUE O FALSE ENTONCES SE CAMBIA EL VALOR DE SETLOGIN, A TRUE O FALSE
        }); //USEEFFECT SIRVE PARA REALIZAR LA CONEXON
    }, []);

    if(login === null) return <Loading isVisible={true} text="Cargando..."/>;


    return login ? <UserLogged/> : <UserGuest/>; // ESTO ES UN RETURN EN LA CUAL PRIMERO
    //COMPRUEBA SI LOGIN ES TRUE O FALSE , SI ES TRUE, ENTRA A "UserLogged"
    // Si es FALSE ENTRA A "UserGuest".
}