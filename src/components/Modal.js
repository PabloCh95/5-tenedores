// esto va a ser un modal para cuando quieran modificar algun dato del usuario
//va a ser dinamico, se va a adaptar por si quieren cambiar el nombre
//email, o password
//rnfs + tab >> esto me crea una export default function () con la importacion de lo que necesito

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Overlay} from 'react-native-elements' //este componente me permite hacer el modal
//crea una ventana emergente , sobresaliendo de la pagina principal

export default function Modal(props) {
    const { isVisible, setIsVisible, children }=props;
    //children va a ser el componente que deseemos que renderice
    const closeModal = () => setIsVisible(false);
    /*Esto es para cuando el usuario haga click fuera del modal, se cierre */
    
    
    return (
      <Overlay
        isVisible={isVisible}
        windowBackgroundColor="rgba(0,0,0,0.5)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlay}
        onBackdropPress={closeModal} 
      >
        {children}
      </Overlay>
    );
}

const styles = StyleSheet.create({
  overlay: {
    height: "auto",//esto es para que solo el modal sea del tamaño de su contenido
    width: "90%",
    backgroundColor: "#fff",
  },
});
