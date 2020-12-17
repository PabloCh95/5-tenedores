import React, { useRef } from "react";
import {StyleSheet, View, Text, Image} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";//este componente es para que cuando utilice el teclado se deslize automaticamente para que podamos visualizar el input que estoy completando
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/Account/RegisterForm";

export default function Regiser()
{
    const toastRef= useRef();
    return(
        <KeyboardAwareScrollView>
       
            <Image 
                source={require("../../../assets/Img/logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
               <RegisterForm toastRef={toastRef} />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />

        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewForm:{
        marginRight:40,
        marginLeft: 40,
    }
});