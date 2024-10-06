import * as React from 'react';
import { Provider } from 'react-redux';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import store from './src/store';
import PV from './src/technicien/PV';
import NoteFrais from './src/screens/NoteFrais';
import Conge from './src/screens/Conge';
import Login from './src/screens/Login';
import ProgrammeStack from './src/technicien/ProgrammeStack';
import InterventionsStack from './src/chef/Interventions';
import Deconnexion from './src/components/Deconnexion';
import InterventionsStackRec from './src/reception/InterventionsRec';
import PVReceptions from './src/reception/PVReceptions';
import ReceptionsStack from './src/reception/Receptions';
import PrereceptionsStack from './src/reception/PreReceptions';
import NewReception from './src/technicien/NewReception';
import CongesStack from './src/chef/Conges';
import DemandesInterventions from './src/chef/demandesIntreventions';
import AddedInterventions from './src/technicien/AddedInterventions';
import { IsAPIExist } from './src/components/utils';
import EnterAPI from './src/screens/EnterAPI';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLogined, setLogined] = useState(false);
  const [apiExists, setApiExists] = useState(false);  // State to track if API exists
  const [loading, setLoading] = useState(true);  // State to track if check is in progress

  // Use useEffect to handle the async API check
  useEffect(() => {
    const checkAPI = async () => {
      const exists = await IsAPIExist();  // Await the result of the async check
      setApiExists(exists);  // Set the result
      setLoading(false);  // We're done loading
    };

    checkAPI();  // Call the async function to check if the API exists
  }, []);

  // Show a loading indicator while checking
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Check if the file exists when the app loads
  if (!apiExists) {
    return <EnterAPI setApiExists={setApiExists} />;
  }

  if (!isLogined) {
    return (
      <Provider store={store}>
        <Login isLogined={isLogined} setLogined={setLogined} />
      </Provider>);
  } else if (isLogined === 1) { // technicien
    return (
      <Provider store={store}>
        {/* <PersistGate> */}
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Programme">
            <Drawer.Screen name="Programme" component={ProgrammeStack} />
            <Drawer.Screen name="Iterventions ajoutées" component={AddedInterventions} />
            <Drawer.Screen name="Nouvelle réception" component={NewReception} />
            <Drawer.Screen name="PVs" component={PV} />
            <Drawer.Screen name="Notes de frais" component={NoteFrais} />
            <Drawer.Screen name="Congés" component={Conge} />
            <Drawer.Screen name="Déconnexion">
              {() => {
                return (
                  <Deconnexion setLogined={setLogined} />
                );
              }}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
        {/* </PersistGate> */}
      </Provider>
    );
  } else if (isLogined === 2) { // chef
    return (
      <Provider store={store}>
        {/* <PersistGate> */}
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Interventions">
            <Drawer.Screen name="Interventions" component={InterventionsStack} />
            {/* <Drawer.Screen name="Programmes && techniciens" component={Programmes} /> */}
            <Drawer.Screen name="Demandes des interventions" component={DemandesInterventions} />
            <Drawer.Screen name="Pré-réceptions" component={PrereceptionsStack} />
            <Drawer.Screen name="Réceptions" component={ReceptionsStack} />
            <Drawer.Screen name="Notes de frais" component={NoteFrais} />
            <Drawer.Screen name="Demandes de congés" component={CongesStack} />
            <Drawer.Screen name="Déconnexion">
              {() => {
                return (
                  <Deconnexion setLogined={setLogined} />
                );
              }}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
        {/* </PersistGate> */}
      </Provider>
    );
  } else if (isLogined === 3) { // reception
    return (
      <Provider store={store}>
        {/* <PersistGate> */}
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Interventions">
            <Drawer.Screen name="Interventions" component={InterventionsStackRec} />
            <Drawer.Screen name="Pré-réceptions" component={PrereceptionsStack} />
            <Drawer.Screen name="Réceptions" component={ReceptionsStack} />
            <Drawer.Screen name="PVs" component={PVReceptions} />
            <Drawer.Screen name="Notes de frais" component={NoteFrais} />
            <Drawer.Screen name="Congés" component={Conge} />
            <Drawer.Screen name="Déconnexion">
              {() => {
                return (
                  <Deconnexion setLogined={setLogined} />
                );
              }}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
        {/* </PersistGate> */}
      </Provider>
    )
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
