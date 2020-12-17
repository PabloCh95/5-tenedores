import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from "../screen/Account/Account";
import Login from "../screen/Account/Login";
import Register from "../screen/Account/Register";

const Stack=createStackNavigator();

export default function accountStack(){

    return(
        <Stack.Navigator>
            <Stack.Screen
              name='account'
              component={Account}
              options={{title:'Mi Cuenta'}}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{title:"Iniciar Sesion"}}
            />
            <Stack.Screen
                name="register"
                component={Register}
                options={{title:"Registro"}}
            />
            
        </Stack.Navigator>
    );
}