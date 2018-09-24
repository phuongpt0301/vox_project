// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Picker,TouchableOpacity,ActivityIndicator} from "react-native";
import {Container, Button, Header, Left, Right, Body, Icon, Title,Spinner, Item, List} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import {Styles, Images, Field, NavigationHelpers, Avatar} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import api from '../Utils/api';
import helper from '../Utils/helper';

import ImagePicker from "react-native-image-picker";
import Toast,{DURATION} from "react-native-easy-toast";
import {loginUser} from "../actions/AuthActions";
import { connect } from "react-redux";

var allcountries = require('countries-cities');

//console.log(allcountries.getCountries());
//console.log(allcountries.getCities('India'));

export  class SignUp extends Component {

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    constructor(props) {
        
        super(props)

        this.state = {
            isLoading: false,
            containerLoading:false,
            user_name:'',
            photo:'',
            user_email:'',
            user_password:'',
            user_phonenumber:'',
            user_age:'',
            user_repeatpassword:'',
            selected1:"key0",
            selected2:"key0",
            countryList:allcountries.getCountries(),
            cityList:[],
            selectCountry:'-1',
            selectCity:'-1',
            facebook_id:'',
            google_id:''
        }
    }

     componentWillMount() {

        if(this.props.navigation.state.params){

            console.log('this.props.navigation.state.params.type===',this.props.navigation.state.params.type);
            
            if(this.props.navigation.state.params.type=='google'){

                this.setState({user_name:this.props.navigation.state.params.name,user_email:this.props.navigation.state.params.email,facebook_id:'',google_id:this.props.navigation.state.params.id})

            }else{

                this.setState({user_name:this.props.navigation.state.params.name,user_email:this.props.navigation.state.params.email,facebook_id:this.props.navigation.state.params.id,google_id:''})
            }
            
        }
        
        //this.getCountries();
    }

    getCites(country_id){

            let data ={
                country_id:country_id
            }

            console.log(data);

            this.setState({isLoading:true});

            api.postApi('city_list_service.php',data)
                  .then((res) => {

                    console.log(res);
                    if(res.Result=='True'){
                        
                        
                        this.setState({isLoading:false,cityList:res.data}); 

                    }else{

                         this.setState({isLoading:false}); 
                    }
                   
            })
            .catch((e) => {

                     //alert(e.message);
                //this.refs.toast.show(e.message);
                this.setState({isLoading:false});

            })

    }


    getCountries(){

            let data ={
                user_id:''
            }

            this.setState({containerLoading:true});

            api.postApi('country_list_service.php',data)
                  .then((res) => {

                   
                    if(res.Result=='True'){
                        
                        
                        this.setState({containerLoading:false,countryList:res.data}); 

                    }else{

                         this.setState({containerLoading:false}); 
                    }
                   
            })
            .catch((e) => {

                     //alert(e.message);
                //this.refs.toast.show(e.message);
                this.setState({containerLoading:false});

            })

    }

    selectStateObject(itemValue, itemIndex){

        //console.log(itemValue, itemIndex);
        //this.getCites(itemIndex);
    
        this.setState({selectCountry:itemValue,isLoading:false,cityList:allcountries.getCities(itemValue)}); 
       
    }

    renderCountryList(){

        var pickerArray =[];

        pickerArray.push(<Picker.Item key='-1' value='-1' label='Select Country' />);

        if(this.state.countryList.length>0){

            for(let data in this.state.countryList){  


                pickerArray.push(<Picker.Item key={data} value={this.state.countryList[data]} label={this.state.countryList[data]} />);
            }

        }

        return pickerArray;


    }

    renderCityList(){

        var pickerCityArray =[];
        pickerCityArray.push(<Picker.Item key='-1' value='-1' label='Select City' />);

        if(this.state.cityList.length>0){

            for(let data in this.state.cityList){  


                pickerCityArray.push(<Picker.Item key={data} value={this.state.cityList[data]} label={this.state.cityList[data]} />);
            }

        }

        return pickerCityArray;


    }

    onValueChange(value: string){
        this.setState({
            selected1:value
        });
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    @autobind
    async getImage(): Promise<void> {
       


        console.log('camera start');
        
        var options ={
            title:'Select Avatar',
            maxWidth:512,
            maxHeight:512,
            storageOptions:{
                skipBackup:true,
                path:'images'
            }
        }

        ImagePicker.showImagePicker(options,(response) =>{

            if(response.didCancel){

            }else if(response.error){

            }else if(response.customButton){

            }else{


                this.setState({photo:response.uri,disabled:false});
            }
        })
    }

    @autobind
    signIn() {
        try {
            
             var user_email = this.state.user_email;
             var user_name = this.state.user_name;
             var user_password = this.state.user_password;
             var user_phonenumber = this.state.user_phonenumber;
             var user_age = this.state.user_age;
             var user_country = this.state.selectCountry;
             var city_town = this.state.selectCity;
             var user_repeatpassword = this.state.user_repeatpassword;
             var facebook_id = this.state.facebook_id;
             var google_id = this.state.google_id;

             var emailRegex = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

             if(user_name==''){

                this.refs.toast.show('Please provide username');

             }else if(user_email==''){

                this.refs.toast.show('Please provide email address');

             }else if(!emailRegex.test(user_email)){

                this.refs.toast.show('Email format is invalid');

             }else if(user_password==''){

                this.refs.toast.show('Please provide password');

             }else if(user_country=='-1'){

                this.refs.toast.show('Please select country');

             }else if(city_town=='-1'){

                this.refs.toast.show('Please select city');

             }else if(user_password!=user_repeatpassword){

                this.refs.toast.show('Password mismatch');

             }else{

                this.setState({isLoading:true});
                let photo ='';

                if(this.state.photo!=''){

                    photo ={
                        uri:this.state.photo,
                        name:'profile.jpg',
                        type:'image/jpg'
                    } 
                }

                let data ={
                    user_name:user_name,
                    user_email:user_email,
                    user_password:user_password,
                    user_phonenumber:user_phonenumber,
                    user_age:user_age,
                    user_country:user_country,
                    city_town:city_town,
                    photo:photo,
                }

                if(facebook_id!=''){

                    data.facebook_id = facebook_id;
                }

                if(google_id!=''){

                    data.google_id = google_id;
                }

                console.log(data);
                var that= this;
                api.postApi('user_register_service.php',data)
                  .then((res) => {

                    //console.log(res);
                    this.setState({isLoading:false});

                    if(res.Result=='True'){

                        console.log('res.data==',res.data);
                        helper.setCache('@userdata',res.data);
                        that.props.loginUser(); 
                       // NavigationHelpers.reset(this.props.navigation, "Main");

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
            this.setState({isLoading:false});
            this.refs.toast.show(e.message);
        } 
    }

    render(): React$Element<*> {
        const {containerLoading} = this.state;

        if(containerLoading){

             return <Container>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Registeration</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={ Styles.flex }>
                      <ActivityIndicator
                        animating={ containerLoading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>

            </Container>

        }else{

            return <Container>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Регистрация </Title>
                </Body>
                <Right/>
            </Header>
            <Toast ref="toast"/> 
            <ScrollView style={{ backgroundColor: "white", flex: 1 }} >
                <KeyboardAvoidingView behavior="padding">
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center' }}>
                         <TouchableOpacity onPress={this.getImage}>
                         {this.state.photo!=''&&<Image style={{width:100,height:100}} source={{uri:this.state.photo}}/>}
                        {this.state.photo==''&&<Avatar size={100}/>}
                        </TouchableOpacity>
                        </View>
                    <Field label="Потребител" autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                value={this.state.user_name}
                                onChangeText={(user_name) => this.setState({user_name})}
                                 />
                    <Field label="Имейл"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                value={this.state.user_email}
                                onChangeText={(user_email) => this.setState({user_email})}
                                 />
                    <Field label="Телефон " 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                value={this.state.user_phonenumber}
                                onChangeText={(user_phonenumber) => this.setState({user_phonenumber})}
                                />
                    <Field label="Възраст" 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                value={this.state.user_age}
                                onChangeText={(user_age) => this.setState({user_age})}
                                />

                    
                    <Picker mode='dropdown' style={{color:'#b1b1b1' ,marginLeft:7, marginTop:20}} 
                     selectedValue={this.state.selectCountry} onValueChange={(itemValue, itemIndex) => this.selectStateObject(itemValue, itemIndex)}>
                      {this.renderCountryList()}
                    </Picker>

                    <Picker mode='dropdown' style={{color:'#b1b1b1' ,marginLeft:7, marginTop:20}} 
                     selectedValue={this.state.selectCity} onValueChange={(itemValue, itemIndex) => this.setState({selectCity:itemValue})}>
                      {this.renderCityList()}
                    </Picker>


                    <Field label="Парола" secureTextEntry 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                value={this.state.user_password}
                               onChangeText={(user_password) => this.setState({user_password})}  />

                    <Field label="Парола отново  " secureTextEntry secureTextEntry 
                                autoCapitalize="none"
                                autoCorrect={false} 
                                keyboardType="default"
                                returnKeyType="next"
                                value={this.state.user_repeatpassword}
                                onChangeText={(user_repeatpassword) => this.setState({user_repeatpassword})}  />
                </KeyboardAvoidingView>
            </ScrollView>
            <Button primary full onPress={this.signIn} style={{height: variables.footerHeight}}>
                {this.state.isLoading ? <Spinner color="white"/> : <Icon name="md-checkmark"/>}
            </Button>
        </Container>;
    }

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
})(SignUp);

const style = StyleSheet.create({
    circle: {
        backgroundColor: "white",
        height: 125,
        width: 125,
        borderRadius: 62.5,
        justifyContent: "center",
        alignItems: "center"
    }
});