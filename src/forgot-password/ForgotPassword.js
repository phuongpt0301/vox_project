// @flow
import autobind from "autobind-decorator";
import {observer} from "mobx-react/native";
import React from "react";
import {StyleSheet, Image, View} from "react-native";
import {Button, Spinner, Text, Container, Header, Left, Right, Body, Icon, Title} from "native-base";
import type { NavigationScreenProp } from "react-navigation";

import ForgotPasswordStore from "./ForgotPasswordStore";

import {Images, WindowDimensions, Field, Small, Styles} from "../components";

import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";
import variables from "../../native-base-theme/variables/commonColor";
@observer
export default class ForgotPassword extends React.Component {

    constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email:''
     
    }

       
  }

      @autobind
    back() {
        this.props.navigation.goBack();
    }

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    @autobind
    login() {
        this.props.navigation.navigate("Login");
    }

    @autobind
    submit(){
        try {
            
            var email = this.state.email;
             var emailRegex = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

             if(email==''){

                this.refs.toast.show('Please provide email address');

             }
             else if(!emailRegex.test(email)){

                this.refs.toast.show('Email format is invalid');

             }else{

                this.setState({isLoading:true});
                let data ={
                    'user_email':email,
                }
                api.postApi('user_forgot_password_service.php',data)
                  .then((res) => {

                    console.log(res);
                    this.setState({isLoading:false});

                    if(res.Result=='True'){

                      alert("Mail has been sent successfully.");
                      this.props.navigation.navigate("Login");

                    }else{

                        this.refs.toast.show(res.ResponseMsg);
                    }

                    

                    
                    
                  })
                  .catch((e) => {
                     //alert(e.message);
                     this.refs.toast.show(e.message);
                     this.setState({isLoading:false});
                  })


             }
           

        } catch(e) {
           
            this.refs.toast.show(e.message);
        }
    }

    render(): React$Element<*> {
        return<Container>
            <Header >
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                                <Body />
                                <Right />
            </Header>
        <Image source={Images.login} style={style.img}>
            <Toast ref="toast"/> 
            <View style={style.container}>
                <Field
                    label="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({email})}
                    inverse
                />
                <Button primary full onPress={this.submit}>
                {this.state.isLoading ? <Spinner color="white" /> : <Text>Reset Password</Text>}
                </Button>

            </View>
        </Image>
        </Container>;
    }
}

const style = StyleSheet.create({
   heading: {
        marginTop: variables.contentPadding * 2,
        color: "white"
    },
    img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
    container: {
        backgroundColor: "rgba(80, 210, 194, .8)",
        flex: 1,
        justifyContent: "center"
    }
});

