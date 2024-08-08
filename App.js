import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text } from 'react-native';

import PV from './src/technicien/PV';
import NoteFrais from './src/screens/NoteFrais';
import Conge from './src/screens/Conge';
import Login from './src/screens/Login';
import ProgrammeStack from './src/technicien/ProgrammeStack';
import InterventionsStack from './src/chef/Interventions';
import Programmes from './src/chef/Programmes';
import Deconnexion from './src/components/Deconnexion';
import InterventionsStackRec from './src/reception/InterventionsRec';
import PVReceptions from './src/reception/PVReceptions';
import ReceptionsStack from './src/reception/Receptions';
import PreReceptionsStack from './src/reception/PreReceptions';
import NewReception from './src/technicien/NewReception';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLogined, setLogined] = useState(2);
  const [token, setToken] = useState('');
  console.log('token:', token);

  if (!isLogined) {
    return <Login isLogined={isLogined} setLogined={setLogined} setToken={setToken} />;
  } else if (isLogined === 1) { // technicien
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Programme">
          <Drawer.Screen name="Programme" component={ProgrammeStack} />
          <Drawer.Screen name="Nouvelle réception" component={NewReception} />
          <Drawer.Screen name="PVs" component={PV} />
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Congés" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} setToken={setToken} />
              );
            }}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  } else if (isLogined === 2) { // chef
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Interventions">
          <Drawer.Screen name="Interventions" component={InterventionsStack} />
          <Drawer.Screen name="Programmes && techniciens" component={Programmes} />
          <Drawer.Screen name="PreRéceptions" component={PreReceptionsStack} />
          <Drawer.Screen name="Réceptions" component={ReceptionsStack} />
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Congés" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} setToken={setToken} />
              );
            }}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  } else if (isLogined === 3) { // reception
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Interventions">
          <Drawer.Screen name="Interventions" component={InterventionsStackRec} />
          <Drawer.Screen name="Réceptions" component={ReceptionsStack} />
          <Drawer.Screen name="PVs" component={PVReceptions} />
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Congés" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} setToken={setToken} />
              );
            }}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    )
  } else if (isLogined === 4) { // labo
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Labo</Text>
      </View>);
  }
  else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>None</Text>
      </View>
    );
  }
}

// defaultProps Error
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
