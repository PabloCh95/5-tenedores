import React,{useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {ListItem} from 'react-native-elements'
import {map} from 'lodash'
import Modal from '../Modal'
import ChangeDisplayNameForm from "./ChangeDisplayNameForm"//falta importar displaynameform
import ChangeEmailForm from './ChangeEmailForm'
//falta importar  changeemailform
import ChangePasswordForm from './ChangePasswordForm'
//"" importar ChangePasswordForm

export default function AccountOptions(props) {
    const {userInfo, toastRef, setReloadUserInfo} = props
    const [isVisible,setIsVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null); // ahi le paso los componentes que va a renderizar
  //por eso, esta en null

    const selectedComponent = (key) => {
      switch (key) {
        case "displayName":
          setRenderComponent(
            <ChangeDisplayNameForm
              displayName={userInfo.displayName}
              setIsVisible={setIsVisible}
              toastRef={toastRef}
              setReloadUserInfo={setReloadUserInfo}
            />
          );
          setIsVisible(true);
          break;
        case "email":
          setRenderComponent(
            <ChangeEmailForm
              email={userInfo.email}
              setIsVisible={setIsVisible}
              toastRef={toastRef}
              setReloadUserInfo={setReloadUserInfo}
            />
          );
          setIsVisible(true);
          break;
        case "password":
          setRenderComponent(
            <ChangePasswordForm
              setIsVisible={setIsVisible}
              toastRef={toastRef}
            />
          );
          setIsVisible(true);
          break;
        default:
          setRenderComponent(null);
          setIsVisible(false);
          break;
      }
    };

    const menuOptions = generateOptions(selectedComponent);

    return (
      <View>
        {map(menuOptions, (menu, index) => (
          <ListItem
            key={index}
            title={menu.title}
            leftIcon={{
              type: menu.iconType,
              name: menu.iconNameLeft,
              color: menu.iconColorLeft,
            }}
            rightIcon={{
              type: menu.iconType,
              name: menu.iconNameRight,
              color: menu.iconColorRight,
            }}
            containterStyle={styles.menuItem}
            onPress={menu.onPress}
          />
        ))}
        {renderComponent && (
          <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
            {renderComponent}
          </Modal>
        )}
      </View>
    );
}
//funcion con un vector de opciones
function generateOptions(selectedComponent) {
  return [
    {
      title: "Cambiar Nombre y Apellidos",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComponent("displayName"),
    },
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComponent("email"),
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComponent("password"),
    },
  ];
}


const styles=StyleSheet.create({
    menuItem:{
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    }
});