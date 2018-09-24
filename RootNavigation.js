import {Images} from "./src/components";
import {Login} from "./src/login";
import {SignUp} from "./src/sign-up";
import {ForgotPassword} from "./src/forgot-password";
import {Drawer} from "./src/drawer";
import {Top} from "./src/top";
import {Duel} from "./src/duel";
import {Overview} from "./src/overview";
import {Activity} from "./src/activity";
import {Lists} from "./src/lists";
import {Profile} from "./src/profile";
import {Timeline} from "./src/timeline";
import {Settings} from "./src/settings";
import {Create} from "./src/create";
import {Topdetails} from "./src/topdetails";
import {Wallet} from "./src/wallet";
import {Terms} from "./src/terms";
import {Adddual} from "./src/adddual";
import {Viewdualprofile} from "./src/viewdualprofile";
import {Adddualprofile} from "./src/adddualprofile";
import {Startprofile} from "./src/startprofile";
import {Livescore} from "./src/livescore";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import React, {Component} from "react";
import {Dimensions} from "react-native";
import { connect } from "react-redux";


class RootNavigator extends React.Component {
  
  constructor(props) {

    super(props)
  }

  render() {
        
     if (this.props.Islogin == true ){

          return <RootNavLogged  />;

     }else{

        return <RootNav />;  
     }
    
  }
}

const mapStateToProps = state => {
  
  console.log('isreducer=====',state.AuthReducer.Islogin);
  return {
    Islogin:state.AuthReducer.Islogin
  };
};

export default connect(mapStateToProps)(RootNavigator);

const LeftNavigator = DrawerNavigator({
    
  
    Дуел: { screen: Duel },
    Активност: { screen: Activity },
    Класация: { screen: Lists }
}, {
    drawerWidth: Dimensions.get("window").width,
    contentComponent: Drawer,
    drawerPosition:'left'
});

const RootNavLogged = StackNavigator({

    Login: { screen: Login },
    SignUp: { screen: SignUp },
    ForgotPassword: { screen: ForgotPassword },
}, {
    headerMode: "none"
});
   

const RootNav = StackNavigator({     
   
    
    Main: { screen: LeftNavigator },
    Startprofile:{ screen: Startprofile },
    Topdetails: { screen: Topdetails },
    Adddual: { screen: Adddual },
    Viewdualprofile:{ screen: Viewdualprofile },
    Adddualprofile: { screen: Adddualprofile },
    Dual: { screen: Duel },
    Profile:{ screen: Profile },
    Wallet:{ screen: Wallet },
    Terms:{ screen: Terms },
    Livescore:{ screen: Livescore }
    
}, {
    headerMode: "none",
    initialRouteName : 'Startprofile'
});