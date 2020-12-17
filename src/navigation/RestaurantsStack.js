import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Restaurants from '../screen/Restaurants/Restaurants';
import AddRestaurant from '../screen/Restaurants/AddRestaurant';
import Restaurant from '../screen/Restaurants/Restaurant';
import AddReviewRestaurant from '../screen/Restaurants/AddReviewRestaurant';

const Stack=createStackNavigator();

export default function restaurantsStack(){

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="restaurants"
          component={Restaurants}
          options={{title: "Restaurantes"}}
        />
        <Stack.Screen
          name="add-restaurant"
          component={AddRestaurant}
          options={{title: "Añadir nuevo restaurante "}}
        />
        <Stack.Screen
          name="restaurant"
          component={Restaurant}
        />
        <Stack.Screen 
          name="add-review-restaurant"
          component={AddReviewRestaurant}
          options={{ title:"Nuevo comentario" }}
        />
      </Stack.Navigator>
    );
}