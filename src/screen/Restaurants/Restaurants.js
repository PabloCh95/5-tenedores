import React , {useState, useEffect, useCallback } from 'react'
import {StyleSheet , View } from 'react-native'
import {Icon}    from 'react-native-elements'
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import ListRestaurants from "../../components/Restaurants/ListRestaurants"

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
    const { navigation } = props; //en este caso tomamos navigation de las props de restaurants
    //el motivo? porque como restaurants es la pagina principal del stack , por ese motivo se le pasa el navigation por props
    const [user, setUser] = useState(null)
    const [ restaurants , setRestaurants] = useState([])
    const [totalRestaurants, setTotalRestaurants]= useState(0)// esto lo usamos para que nos guarde el total de restaurantes.
    const [startRestaurants, setStartRestaurants]= useState(null)
    const [isLoading,setIsLoading] = useState(false);
    const limitRestaurants = 10; 

    
    useEffect(() => {
      firebase.auth().onAuthStateChanged((userInfo)=>{
        setUser(userInfo);
      })
    }, []);
//useFocusEffect lo usamos para actualizar la lista para cuando se suba un nuevo restaurante, utliza un useCallback
    useFocusEffect(
      useCallback(()=>{
        db.collection("restaurants")
          .get()
          .then((snap) => {
            setTotalRestaurants(snap.size); //aca guarda en totalRestaurants la cantidad de restaurantes que hay almacenados
          });

        const resultRestaurants = []; //

        db.collection("restaurants") //aca accede a la carpeta restaurants
          .orderBy("createAt", "desc") //mostramos en un orden descendente (del ultimo creado al mas viejo) y por fecha de creacion
          .limit(limitRestaurants)
          .get()
          .then((response) => {
            setStartRestaurants(response.docs[response.docs.length - 1]); //esto obtiene todos los documentos , el ultimo - 1. esto es porque el array comienza con 0

            response.forEach((doc) => {
              const restaurant = doc.data();
              restaurant.id = doc.id;
              resultRestaurants.push(restaurant);
            });
            setRestaurants(resultRestaurants);
          });
      })
    );

    //funcion para obtener los siguientes restaurantes.
    const handleLoadMore = () =>{
      const resultRestaurants = [];
      restaurants.length < totalRestaurants && setIsLoading(true);

      db.collection("restaurants")
        .orderBy("createAt", "desc")
        .startAfter(startRestaurants.data().createAt)
        .limit(limitRestaurants)
        .get()
        .then((response)=>{
          if(response.docs.length > 0){
            setStartRestaurants(response.docs[response.docs.length - 1]);
          }else{
            setIsLoading(false);
          }

          response.forEach((doc)=>{
            const restaurant = doc.data();
            restaurant.id = doc.id;
            resultRestaurants.push(restaurant);
          });
          setRestaurants([...restaurants, ...resultRestaurants]);
          
        });
    }
    return (
      <View style={styles.viewBody}>
        <ListRestaurants 
          restaurants={restaurants}
          handleLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
        {user && (
          <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btnContainer}
          onPress={()=> navigation.navigate("add-restaurant")}
          />
        )}
        
      </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#fff",
    },
    btnContainer:{
        position:"absolute",
        bottom:10,
        right:10,
        shadowColor:"black",
        shadowOffset:{ width:2, height:2},
        shadowOpacity: 0.5,
    },
})