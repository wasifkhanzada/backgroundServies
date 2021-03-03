/**
 * Name: Muhammad Wasif Khanzada
 * Email: wasifkhanzada309.wk@gmail.com
 * Phone Number: 03152812753
 * Skype: wasifkhanzada1
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';

import BackgroundJob from 'react-native-background-actions';

const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

const taskRandom = async (taskData) => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
    );
  }
  await new Promise(async (resolve) => {
    // For loop with a delay
    const {delay} = taskData;
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await BackgroundJob.updateNotification({taskDesc: 'Runned -> ' + i});
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Background Servies',
  taskTitle: 'Background Servies',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#000',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
};

function handleOpenURL(evt) {
  console.log(evt.url);
  // do something with the url
}

Linking.addEventListener('url', handleOpenURL);

class App extends React.Component {
  state = {
    check: false,
  };

  playing = BackgroundJob.isRunning();

  /**
   * Toggles the background task
   */
  toggleBackground = async () => {
    this.playing = !this.playing;
    if (this.playing) {
      try {
        this.setState({check: true});
        console.log('Trying to start background service');

        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        this.setState({check: false});
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      this.setState({check: false});
      await BackgroundJob.stop();
    }
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.toggleBackground}>
              <Text style={styles.buttonText}>
                {this.state.check || this.playing ? 'CHECK OUT' : 'CHECK IN'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default App;
