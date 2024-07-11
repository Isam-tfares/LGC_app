import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';

import PV from './src/technicien/PV';
import NoteFrais from './src/screens/NoteFrais';
import Conge from './src/screens/Conge';
import Login from './src/screens/Login';
import ProgrammeStack from './src/technicien/ProgrammeStack';
import Interventions from './src/chef/Interventions';

const Drawer = createDrawerNavigator();


export default function App() {
  const [isLogined, setLogined] = useState(false);
  if (!isLogined) {
    return (
      <Login isLogined={isLogined} setLogined={setLogined} />
    );
  }
  else if (isLogined == 1) { // technicien
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Programme">
          <Drawer.Screen name="Programme" component={ProgrammeStack} />
          <Drawer.Screen name="PVs" component={PV} />
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Demande du Congé" component={Conge} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
  else if (isLogined == 2) { // chef 
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Interventions">
          <Drawer.Screen name="Interventions" component={Interventions} />
          <Drawer.Screen name="Programmes && techniciens" component={PV} />
          <Drawer.Screen name="Notes de frais chef" component={NoteFrais} />
          <Drawer.Screen name="Demande du Congé chef" component={Conge} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return (<View><Text>None</Text></View>);
  }

}
