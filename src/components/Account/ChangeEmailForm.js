import React , {useState} from 'react'
import {StyleSheet, View, Text } from 'react-native'
import {Input, Button} from 'react-native-elements';
import * as firebase from "firebase"
import { validateEmail } from '../../utils/validation';
import { reauthenticate } from '../../utils/api';

export default function ChangeEmailForm(props) {
    const {email,setIsVisible, toastRef, setReloadUserInfo}=props;
    const [formData, setFormData] = useState(defaultValue());
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading,setIsLoading]= useState(false);
    const onChange = (e,type)=>{//esta funcion recibe el evento y el tipo
        //(e)= evento = el contenido de lo que se quiere guardar
        // type= tipo = es el tipo de dato que se va a guardar
        //por ejemplo email, o password
        setFormData({...formData, [type]:e.nativeEvent.text})
    }
    const onSubmit = () =>{
        setErrors({});
        if(!formData.email || email === formData.email){
            setErrors({
                email:"El email no ha cambiado.",
            })
        }else if(!validateEmail(formData.email)){
            setErrors({
                email:"Email Incorrecto.",
            });
        }else if(!formData.password){
            setErrors({
                password: "La contraseña no puede estar vacia.",
            });
        } else {
            setIsLoading(true);
            reauthenticate(formData.password)
            .then(()=>{
                firebase.auth()
                    .currentUser.updateEmail(formData.email)
                    .then(()=>{
                        setIsLoading(false);
                        setIsVisible(false);
                        setReloadUserInfo(true);
                        toastRef.current.show("Email actualizado correctamente.");
                        
                    })
            }).catch(()=>{
                setIsLoading(true);
                setErrors({password:"La contraseña no es correcta."});
            });
        }
    };

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Email"
                containerStyle={styles.input}
                defaultValue={email || ""}
                rightIcon={{
                    type: "material-community",
                    name:"at",
                    color: "#c2c2c2",
                }}
                onChange={(e)=>onChange(e,"email")} 
                errorMessage={errors.email}
            />
            <Input 
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type:"material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e)=>onChange(e,"password")}
                errorMessage={errors.password}
            />
            <Button 
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

function defaultValue(){
    return{
        email:"",
        password:"",
    };
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
  btnContainer:{
        marginTop:20,
        width:"95%",
  },
  btn: {
      backgroundColor:"#00a680",
  }
});