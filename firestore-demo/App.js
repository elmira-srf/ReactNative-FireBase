import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EmployeeFormScreen from './screens/EmployeeFormScreen';
import EmployeesListScreen from "./screens/EmployeesListScreen"

const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>     
        <Stack.Navigator initialRouteName="EmployeesListScreen">
          <Stack.Screen component={EmployeeFormScreen} name="EmployeeFormScreen"></Stack.Screen>
          <Stack.Screen component={EmployeesListScreen} name="EmployeesListScreen"></Stack.Screen>          
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
