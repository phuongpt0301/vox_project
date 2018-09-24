// @flow
import autobind from "autobind-decorator";
import React from "react";
import {View, Image, StyleSheet, ScrollView, KeyboardAvoidingView,AsyncStorage,Alert} from "react-native";
import {H1, Container, Button, Text,Spinner} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import Mark from "./Mark";
import {Small, Styles, Images, Field, NavigationHelpers, WindowDimensions} from "../components";
import variables from "../../native-base-theme/variables/commonColor";


import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";

import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
FBLoginManager.setLoginBehavior()
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
// import GoogleSignIn from 'react-native-google-sign-in';

import {loginUser} from "../actions/AuthActions";
import { connect } from "react-redux";

export  class Login extends React.Component {

    constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      fbLoading:false,
      googleLoading:false,
      containerLoading:false,
      email:'',
      password:''
    }
   
       
  }
  
    props: {
        navigation: NavigationScreenProp<*, *>
    }

    componentWillMount() {  

        this.googleConfigure();
        // this.setState({containerLoading:true}); 

        
        // helper.getCache('@userdata').then((res) => {

        //    //alert(JSON.stringify(res));
        //   if(res){

        //       res = JSON.parse(res);   
        //        if(res.loginforuce){    

        //          // alert('ininin');
        //           res.loginforuce = false;
        //           helper.setCache('@userdata',res);
        //           this.setState({containerLoading:false}); 
        //        }
        //        else {

        //          // alert('outtt');
        //            this.setState({isLoading:false,fbLoading:false,containerLoading:false});
        //            //NavigationHelpers.reset(this.props.navigation, "Startprofile"); 
        //             this.props.navigation.navigate("Startprofile");
        //         }
        //     }
           
        //     else{

        //         let data = {
        //           'user_id':0,
        //           'user_name':'guest',
        //           'user_email':'guest@gmail.com',
        //           'user_password':'password123#',
        //           'user_phonenumber':'123456789',
        //           'user_age':'15',
        //           'user_country':'USA',
        //           'city_town':'cam',
        //           'pvp_tokens':0,
        //           'top10':0,
        //           'quiz':0,
        //           'duel':0,
        //           'totaltime':0,
        //           'rating':0,
        //           'number_of_user':0,
        //           'photo':'',
        //         }
   
        //         helper.setCache('@userdata',data);
        //         this.setState({containerLoading:false}); 
        //         NavigationHelpers.reset(this.props.navigation, "Startprofile"); 
        //     }
            
           
        // })

        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
    }

    async googleConfigure() {
  await GoogleSignIn.configure({
    // iOS     
    clientID: '5443532141-6l7nmuukcb2ghgol8iqt80q1837agqcv.apps.googleusercontent.com',

    // iOS, Android
    // https://developers.google.com/identity/protocols/googlescopes
    scopes: ['profile', 'email'],

    // iOS, Android
    // Whether to request email and basic profile.
    // [Default: true]
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a06bf16b507496b126d25ea909d366ba4
    shouldFetchBasicProfile: true,

    // iOS
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a486c8df263ca799bea18ebe5430dbdf7
    language: '',

    // iOS
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd
    loginHint: '',

    // iOS, Android
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#ae214ed831bb93a06d8d9c3692d5b35f9
    serverClientID: '5443532141-igh8ce5ssaieo6sgr882c6tjc4bo2ta6.apps.googleusercontent.com',

    // Android
    // Whether to request server auth code. Make sure to provide `serverClientID`.
    // https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInOptions.Builder.html#requestServerAuthCode(java.lang.String, boolean)
    offlineAccess: true,
    
    // Android
    // Whether to force code for refresh token.
    // https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInOptions.Builder.html#requestServerAuthCode(java.lang.String, boolean)
    forceCodeForRefreshToken: true,

    // iOS
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a211c074872cd542eda53f696c5eef871
    openIDRealm: '',

    // Android
    // https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInOptions.Builder.html#setAccountName(java.lang.String)
    accountName: '',

    // iOS, Android
    // https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a6d85d14588e8bf21a4fcf63e869e3be3
    hostedDomain: '',
  });

    
}
  
       

    @autobind
    forgotPassword() {
       this.props.navigation.navigate("ForgotPassword");
    }
    
    @autobind 
    signIn(){
        try {

             var email = this.state.email;
             var password = this.state.password;
             var emailRegex = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

             if(email==''){

                this.refs.toast.show('Please provide email address');

             }else if(password==''){

                this.refs.toast.show('Please provide password');
             }
             else if(!emailRegex.test(email)){

                this.refs.toast.show('Email format is invalid');

             }else{

                this.setState({isLoading:true});
                let data ={
                    'user_email':email,
                    'user_password':password
                }

                console.log(data);

                api.postApi('user_login_service.php',data)
                  .then((res) => {  

                    console.log(res);
                    if(res.Result=='True'){

                       // alert(JSON.stringify(res.data));
                       console.log('loginuser====res.data=========',res.data);
                         helper.setCache('@userdata',res.data);
                         this.checkIn(res.data.user_id);
                        

                    }else{
                        this.setState({isLoading:false});
                        this.refs.toast.show(res.ResponseMsg);
                    }
      
                       
                    
                  })
                  .catch((e) => {
                     //alert(e.message);
                     console.log(e);
                     this.refs.toast.show(e.message);
                     this.setState({isLoading:false});
                  })
    

             }

             

        } catch(e) {
            this.setState({isLoading:false});
            this.refs.toast.show(e.message);
        }  
    }      
    
    checkIn(user_id){
       
                try{

                     let that =this;
                        let data ={
                            'user_id':user_id,
                            'spend_type':'I'
                        }
                    //console.log(data);        
                    that.props.loginUser(); 

                } catch(e) {
                      console.log('catch error list login',e);
                     
                }
                
                // api.postApi('add_time_service.php',data)
                //   .then((res) => {

                //     console.log('res=======',res);
                    
                //         console.log('this.props.navigation====',this.props.navigation);
                //         //this.setState({isLoading:false,fbLoading:false,googleLoading:false});   
                //         //NavigationHelpers.reset(this.props.navigation, "Startprofile");
                //        that.props.loginUser();  
                        
                //   })
                //   .catch((e) => { 
                //      //alert(e.message);
                //      console.log(e.message);
                //      //this.refs.toast.show(e.message);
                //      //this.setState({isLoading:false});
                //   })


             }

    

    @autobind
    signUp() {
        this.props.navigation.navigate("SignUp");
    }

        @autobind
    addDual() {
        this.props.navigation.navigate("Startprofile");
    }

    @autobind
    fbSignIn() {

        console.log('fbsigninni==');
        this.setState({'fbLoading':true});
        var that= this;

        FBLoginManager.loginWithPermissions(['public_profile','email'], function(error, data){
            if (!error) {
             
              console.log("facebook login",data);
              var fbResponse = JSON.parse(data.profile);
              fbResponse.type='facebook';
             

              let data1 ={
                'facebook_id':fbResponse.id
              }

              that.checkValidLogin(fbResponse,data1);


            } else {

              console.log("Error: ", error);
              that.setState({'fbLoading':false});
            }     
        })     

        
    }

    checkValidLogin(fbResponse,data){

               

                api.postApi('user_validate_service.php',data)
                  .then((res) => {

                    console.log(res);
                    

                    if(res.data.is_new_user=='NO'){

                        helper.setCache('@userdata',res.data);
                        this.checkIn(res.data.user_id);

                    }else{

                        this.setState({'fbLoading':false,'googleLoading':false});
                        
                        this.props.navigation.navigate("SignUp",fbResponse);
                    }
                    
                    //

                    
                  })
                  .catch((e) => {
                     //alert(e.message);
                     console.log(e.message);
                     this.setState({'fbLoading':false});
                     //this.refs.toast.show(e.message);
                     //this.setState({isLoading:false});
                  })
    }

    @autobind
    async signInWithGoogleAsync() {

        try{
          
          console.log('signin google login====eee');    
          this.setState({'googleLoading':true});  
          const user = await GoogleSignIn.signInPromise();
         
         // alert(JSON.stringify(user));  
          console.log('user====',user); 
          if(user)  {

              let data ={
                      'google_id':user.userID
              }

              this.checkValidLogin(user,data);

          } 

        }catch(e) {

            console.log('error',e);
            this.setState({'googleLoading':false});  
        }
            

       
   }

      //   GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    
      //     console.log('play service available ');
      //     GoogleSignin.signIn()
      //     .then((user) => {
      //       alert('user=====');
      //       console.log(user);
            
      //     })
      //     .catch((err) => {
      //       alert('error====');
      //       console.log('WRONG SIGNIN', err);
      //     })
      //     .done();
      // })
      // .catch((err) => {
      //   alert('Playerror====');
      //   console.log("Play services error", err.code, err.message);
      // })

        

      


        // try {
        //   this.setState({'googleLoading':true});
        //   console.log('signin google login');
        //   const result = await Expo.Google.logInAsync({
            
        //     //androidClientId:'197530956170-a3u8mfh6pphhf3t93bgrhgs8h11lng5n.apps.googleusercontent.com',
        //     androidStandaloneAppClientId: '197530956170-mf8pu3nnuj2gvl36eve294hvqp1jk21a.apps.googleusercontent.com',
        //     iosClientId: '',
        //     scopes: ['profile', 'email'],
        //   });

        //   if (result.type === 'success') {
        //     console.log('result.accessToken==',result.accessToken);
        //     const response = await fetch(
        //           `https://www.googleapis.com/userinfo/v2/me`,{
        //             headers:{Authorization: `Bearer ${result.accessToken}`}
        //           });

        //     var googleResponse = await response.json();
        //     googleResponse.type="google";
        //     console.log(googleResponse);
        //     let data ={
        //             'facebook_id':googleResponse.id
        //     }

        //     this.checkValidLogin(googleResponse,data);
        //     return result.accessToken;


        //   } else {

        //     console.log('result.cancelled==');
        //     this.setState({'googleLoading':false});
        //     return {cancelled: true};
        //   }
        // } catch(e) {
        //   console.log('catch error list login');
        //   this.setState({'googleLoading':false});
        //   return {error: true};
        // }
     

   

    render(): React$Element<*> {

        const {containerLoading} = this.state;


           return <Image source={Images.login} style={style.img}>
            <Container style={StyleSheet.flatten(Styles.imgMask)}>
                <Toast ref="toast"/> 
                <ScrollView >
                    <KeyboardAvoidingView behavior="position">
                        <View style={style.logo}>
                            <View>
                                <Mark />
                                <H1 style={StyleSheet.flatten(style.title)}>Get Started!</H1>
                            </View>
                        </View>
                        <View style={style.blur} >
                            <Field
                                label="Имейл"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                value={this.state.email}
                                onChangeText={(email) => this.setState({email})}
                                inverse
                            />
                            <Field
                                label="Парола"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="go"
                                value={this.state.password}
                                onChangeText={(password) => this.setState({password})}
                                onSubmitEditing={this.signIn}
                                last
                                inverse
                            />

                            


                        </View>


                    </KeyboardAvoidingView>

                                <View style={style.signinbutton}>
                                    <Button primary full onPress={this.signIn}>
                                    {this.state.isLoading ? <Spinner color="white" /> : <Text>Влез</Text>}
                                    </Button>
                                </View>

                                <View style={style.socialbtn}>
                                    <View style={style.socialbtninner} >
                                        <Button style={style.fb} onPress={this.fbSignIn}>
                                        {this.state.fbLoading ? <Spinner color="white" /> : <Text>Facebook вход </Text>}
                                        </Button>
                                    </View>

                                    {/* <View style={style.socialbtninner}>
                                        <Button style={style.google} onPress={this.signInWithGoogleAsync}>
                                        {this.state.googleLoading ? <Spinner color="white" /> : <Text>Google вход </Text>}
                                            
                                        </Button>
                                    </View> */}
                                </View>
                                <View>
                                    <Button transparent full onPress={this.signUp}>
                                        <Small style={{color: "white"}}>Нямаш акаунт?Регистрирай се</Small>
                                    </Button>
                                </View>
                                <View>
                                    <Button transparent full onPress={this.forgotPassword}>
                                        <Small style={{color: "white"}}>Забравена парола? </Small>
                                    </Button>
                                </View>
                </ScrollView>
            </Container>
        </Image>;

       

        
    }
}



const mapStateToProps = state => {
  
  console.log('state.AuthReducer===',state.AuthReducer);
  return {
    Islogin: state.AuthReducer.Islogin
  };
}

export default connect(mapStateToProps, {
  loginUser,
})(Login);

const style = StyleSheet.create({
    img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
    content: {
        flex: 1,
        justifyContent: "flex-end"
    },
    logo: {
        alignSelf: "center",
        marginBottom: variables.contentPadding * 1,
    },
    title: {
        marginTop: variables.contentPadding * 2,
        color: "white",
        textAlign: "center" 
    },
    blur: {
        backgroundColor: "rgba(255, 255, 255, .2)"
    },
    socialbtn: {
        flex:2,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialbtninner:{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
        marginRight:10
    },
    fb:{
        backgroundColor:'#4166b2'
    },
    google:{
        backgroundColor:"#ea433b"
    },
    signinbutton:{
        margin:10
    }

});
