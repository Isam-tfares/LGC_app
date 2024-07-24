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
import Receptions from './src/reception/Receptions';
import PVReceptions from './src/reception/PVReceptions';
import ReceptionsStack from './src/reception/Receptions';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLogined, setLogined] = useState(false);

  const handleLogout = () => {
    setLogined(false);
  };

  if (!isLogined) {
    return <Login isLogined={isLogined} setLogined={setLogined} />;
  } else if (isLogined === 1) { // technicien
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Programme">
          <Drawer.Screen name="Programme" component={ProgrammeStack} />
          <Drawer.Screen name="PVs" component={PV} />
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Demande du Congé" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} />
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
          <Drawer.Screen name="Notes de frais" component={NoteFrais} />
          <Drawer.Screen name="Demande du Congé" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} />
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
          <Drawer.Screen name="Demande du Congé" component={Conge} />
          <Drawer.Screen name="Déconnexion">
            {() => {
              return (
                <Deconnexion setLogined={setLogined} />
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
