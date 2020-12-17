import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Search from '../screen/Search';

const Stack = createStackNavigator();


export default function searchStack(){

    return(
        <Stack.Navigator>
            <Stack.Screen
             name="search"
             component={Search}
             options={{ title:"Buscador" }}
            />
        </Stack.Navigator>
    );
}