import React, {useState} from 'react'
import { StyleSheet, View } from 'react-native'
import {Input, Button} from 'react-native-elements'
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
    const {displayName, setIsVisible, toastRef, setReloadUserInfo} = props;
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [error, setError] = useState(null);// esto lo uso para que mande un mensaje en el input  de error
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () =>{
        //a coninuacion las validaciones para el cambio de nombre
        setError(null);
        if (!newDisplayName) {
          setError("El nombre no puede estar vacio.");
        } else if (displayName === newDisplayName) {
          setError("El nombre no puede ser igual al actual.");
        } else {
          setIsLoading(true);
          const update = {
            displayName: newDisplayName.trim(),// esto evita que me tire error por si le añado un espacio de mas en el nombre
          };
          firebase
            .auth()
            .currentUser.updateProfile(update)
            .then(() => {
              setIsLoading(false);
              setIsVisible(false);
              setReloadUserInfo(true);
              toastRef.current.show("Se cambio el nombre correctamente.");
              console.log("ok");
            })
            .catch((err) => {
              console.log(err.message);
              setError("Error al actualizar el nombre.");
              setIsLoading(false);
            });
        }
    }

    return (
      <View style={styles.view}>
        <Input
          placeholder="Nombre y Apellido"
          containerStyle={styles.input}
          rightIcon={{
            type: "material-community",
            name: "account-circle-outline",
            color: "#c2c2c2",
          }}
          defaultValue={displayName || ""}
          onChange={(e)=> setNewDisplayName(e.nativeEvent.text)}
          errorMessage={error}
        />
        <Button
          title="Cambiar nombre"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={onSubmit}
          loading={isLoading}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
