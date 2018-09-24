// @flow
import React, {Component} from "react";
import {Dimensions} from "react-native";
import {StyleProvider} from "native-base";
import { Provider } from "react-redux";
import store from "./src/store";

// import {Font, AppLoading} from "expo";


import RootNavigation from "./RootNavigation";   


import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";


export default class App extends Component {

    constructor(props) {

      super(props)   
    }

    state: { ready: boolean } = {
        ready: true,
    };

    componentWillMount() {
        const promises = [];
        // promises.push(
        //     Font.loadAsync({
        //         "Avenir-Book": require("./fonts/Avenir-Book.ttf"),
        //         "Avenir-Light": require("./fonts/Avenir-Light.ttf"),
        //         "Ionicons":require("./fonts/Ionicons.ttf")
        //     })
        // );
        // Promise.all(promises.concat(Images.downloadAsync()))
        //     .then(() => this.setState({ ready: true }))
        //     // eslint-disable-next-line
        //     .catch(error => console.error(error))
        // ;
    }

    render(): React$Element<*> {
        const {ready} = this.state;
        return <StyleProvider style={getTheme(variables)}>
            {   
                <Provider store={store}>
                    <RootNavigation onNavigationStateChange={() => undefined} />
                </Provider>
            }
        </StyleProvider>;
    }
}



  



export {RootNavigation};
