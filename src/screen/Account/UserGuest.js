import React from 'react';
import {StyleSheet,View,ScrollView,Text, Image} from 'react-native';
import { Button } from "react-native-elements";
import {useNavigation} from "@react-navigation/native";//Esto es un HOOK,vamos a establecer la navegacion
//esta va a ser la screen que vaya a ver el usuario que no este logueado
export default function userGuest(){
   const navigation =useNavigation();
  
    return(
        //Estructura de nuestra pagina
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image
                source={require("../../../assets/Img/user-guest.jpg.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de 5 Tenedores</Text>
            <Text style={styles.description}>           
                ¿Como describiras tu mejor restaurante? Busca y visualiza los mejores
                restaurantes de forma sencilla, vota cual te ha gustado mas y 
                comenta como ha sido tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        
        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft:30,
        marginRight:30,
    },
    image:{
        height:300,
        width:"100%", //cuando es en porcentaje hay que ponerlo entre comillas
        marginBottom:40,
    },
    title: {
     fontWeight:"bold",
     fontSize:19,
     marginBottom: 10,
     textAlign:"center", 
    },
    description:{
        textAlign:"center",
        marginBottom:20, 
    },
    viewBtn:{
        flex:1,
        alignItems:"center",
    },
    btnStyle:{
       backgroundColor:"#00a680", 
    },
    btnContainer:{
        width:"70%"
    }
});