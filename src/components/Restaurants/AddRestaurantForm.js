import React,{useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import {map, size, filter} from "lodash";
import * as Permissions from 'expo-permissions' //esto es para obtener permisos para subir las fotos
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4'; // esto es para cambiar el nombre de las imagenes subidas
import Modal from "../Modal";// esto es un modal previamente diseñado , lo vamos a usar para el mapa

import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width; //esto lo que va a hacer es
//capturar el ancho de la pantalla del movil

export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [ imagesSelected, setImagesSelected] = useState([]);
    const [ isVisibleMap , setIsVisibleMap] = useState(false);//estado del modal de mapas
    const [locationRestaurant,setLocationRestaurant]=useState(null);

    const addRestaurant= () =>{
      if(!restaurantName || !restaurantAddress || !restaurantDescription){
        toastRef.current.show("Todos los campos del formulario son obligatorios");
      }else if(size(imagesSelected) === 8){
        toastRef.current.show("El restaurante tiene que tener al menos una foto");
      }else if(!locationRestaurant){
        toastRef.current.show("Tienes que localizar el restaurante en el mapa");
      }else{
        setIsLoading(true);
        uploadImageStorage().then((response) => {
          
          db.collection("restaurants").add({
            name:restaurantName,
            address:restaurantAddress,
            description:restaurantDescription,
            location:locationRestaurant,
            images:response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid
          })
          .then(()=>{
            setIsLoading(false);
            console.log("OK");
          }).catch(()=>{
            setIsLoading(false);
            toastRef.current.show(
              "Tienes que localizar el restaurante en el mapa"
            );
          });
        });
      
      }
    };
    const uploadImageStorage = async () => {
    const imageBlob = []; // las imagenes van a estar almacenadas en esta constante
      //Promise all>> 
      //falta terminarlo
    await Promise.all(
      //este map es de lodash
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());//ref es donde guardo las imagenes , child (como se va a llamar el contenido)
        await ref.put(blob).then(async (result) => {
          //aca llamamos de nuevo a firebase para que me devuelva las url de las fotos
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );
    return imageBlob;
  };
    return (
      <ScrollView style={styles.scrollview}>
        <ImageRestaurant imagenRestaurant={imagesSelected[0]} />
        <FormAdd
          setRestaurantName={setRestaurantName}
          setRestaurantAddress={setRestaurantAddress}
          setRestaurantDescription={setRestaurantDescription}
          setIsVisibleMap={setIsVisibleMap}
          isVisibleMap={isVisibleMap}
          locationRestaurant={locationRestaurant}
        />
        <UploadImage
          toastRef={toastRef}
          imagesSelected={imagesSelected}
          setImagesSelected={setImagesSelected}
        />
        <Button
          title="Crear Restaurante"
          onPress={addRestaurant}
          buttonStyle={styles.btnAddRestaurant}
        />
        <Map
          setIsVisibleMap={setIsVisibleMap}
          isVisibleMap={isVisibleMap}
          setLocationRestaurant={setLocationRestaurant}
          toastRef={toastRef}
        />
      </ScrollView>
    );
}
//componente para que muestre la imagen principal del restaurante
function ImageRestaurant(props){
    const {imagenRestaurant} = props;

    return (
      <View style={styles.viewPhoto}>
        <Image
          source={//aca hace una condicion... si imagerestaurant
            //tiene contenido, muestra la imagen, sino muestra la no-image.png
            imagenRestaurant
              ? {uri: imagenRestaurant}
              : require("../../../assets/Img/no-image.png")
          }
          style={{width: widthScreen, height: 200}}
        />
      </View>
    );
}
//formulario
function FormAdd(props){
   const {
     setRestaurantName,
     setRestaurantAddress,
     setRestaurantDescription,
     setIsVisibleMap,
     isVisibleMap,
     locationRestaurant,
   } = props; 
    
    return (
      <View style={styles.viewForm}>
        <Input
          placeholder="Nombre del restaurante"
          containerStyle={styles.input}
          onChange={(e) => setRestaurantName(e.nativeEvent.text)}
        />
        <Input
          placeholder="Dirección"
          containerStyle={styles.input}
          onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
          rightIcon={{
            type:"material-community",
            name:"google-maps",
            color:locationRestaurant ? "#00a680":"#c2c2c2",
            onPress: () => setIsVisibleMap(!isVisibleMap)
          }}
        />
        <Input
          placeholder="Descripción"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
        />
      </View>
    );
}
//modal del mapa
function Map(props){
  const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );

      const statusPermissions= await resultPermissions.permissions.location.status;

      if(statusPermissions !=='granted'){
         toastRef.current.show(
          "Tienes que aceptar los permisos de localizacion para crear un restaurante",
          3000
        );
      }else{
         const loc = await Location.getCurrentPositionAsync({});
         setLocation({
           latitude: loc.coords.latitude,
           longitude: loc.coords.longitude,
           latitudeDelta: 0.001,
           longitudeDelta: 0.001,
         });
      }
    })();
  },[]);

  const confirmLocation = () =>{
    setLocationRestaurant(location);
    toastRef.current.show("Localizacion guardada correctamente");
    setIsVisibleMap(false);
  }
  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              dragable
            />
            {/* Marker es un marcador para apuntar la direccion de una ubicacion en el mapa
               dragable: que se va a poder mover
              */}
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button 
            title="Guardar ubicacion" 
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button 
            title="Cancelar ubicacion" 
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={()=>setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );

}
//funcion para subir imagenes
function UploadImage(props){
  const {toastRef, imagesSelected, setImagesSelected} = props;
  
  const imageSelect = async () =>{ //en esta funcion cargamos la imagen
      const resultPermissions = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );//esta constante guarda el permiso para ingresar a tomar fotos de la galeria
      
     if(resultPermissions === "denied"){
        toastRef.current.show("Es Necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente", 3000);
     } else { //estos if validan el permiso
       const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing:true,
         aspect:[4 , 3],
      });// esta constante guarda las imagenes de la galeria

      // console.log(result);
      if(result.cancelled){
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen",
          2000
        );//si el usuario cancela la solicitud aparece un toast
      }else{
        // console.log();
        setImagesSelected([...imagesSelected, result.uri]);//añade el contenido y un nuevo valor
      }
     }
  };

  //funcion para eliminar imagenes seleccionadas.
  const removeImage= (image)=>{
    Alert.alert( //Alert va a mostrar un mensaje al usuario y le pregunta...>>
      "Eliminar Imagen",
      "¿Estas seguro de que quieres eliminar la imagen?",
      //luego toma 2 opciones, si cancela, cierra la alerta.
      //Pero si desea eliminar la imagen, la quita del vector de imagenes seleccionadas
      [
        {
          text:"Cancel",
          style:"cancel",
        },
        {
          text:"Eliminar",
          onPress: () => {
            setImagesSelected(
              //filter lo que hace es un bucle del vector y devolveremos todas
              //las imagenes que esten en filter, excepto el de la imagen
              //que se selecciono para eliminar...(image)
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
        {cancelable:false}
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {//map me permite hacer un bucle sobre la variable imagesSelected,(que es un vector y ejecutar una funcion, imagerestaurant recibe una foto e index x si hay mas de 1 foto.)
      map(imagesSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{uri: imageRestaurant}}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  scrollview: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: "90%",
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContainerSave:{
    paddingRight:5,
  },
  viewMapBtnSave:{
    backgroundColor:"#00a680",
  }
});
