// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet, KeyboardAvoidingView, ScrollView ,Text, Picker,TouchableOpacity,ActivityIndicator,Modal,TouchableHighlight,TextInput,Alert,Keyboard } from "react-native";
import {H1} from "native-base";
import {Container, Button, Header, Left, Right, Body, Icon, Title,Spinner, Item} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import { Col, Row, Grid } from 'react-native-easy-grid';
import {BaseContainer, Avatar, TaskOverview, Small, Styles,Images, Task, Field, NavigationHelpers,WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";
import ImagePicker from "react-native-image-picker";

import {
  fetchDuelList,
} from "../actions/DuelAction";
import { connect } from "react-redux";

export  class Adddual extends Component {

    constructor(props) {
        super(props)

        this.image_path = 'http://voxpopuliapp/services/images/user_image/';
        this.imagechange= false;
        this.state = {
            user_id: '',
            firstname:'',
            secondname:'',
            firstphoto:'',
            secondphoto:'',
            token:0,
            loading:true,
            selected1: "key1",
            selected2: "key1",
            userList:[],
            duel_token:'',
            modalVisible: false,

        }
  }




  onValueChange(value: string) {
    this.setState({
      selected1: value
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            console.log(res);
            if(res){

                this.userData = JSON.parse(res);
               

                this.setState({token:this.userData.tokens,user_id:this.userData.user_id})

                this.getData(this.userData.user_id);
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })

        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
  }

  getData(user_id){

            let data ={
                user_id:user_id
            }
            
            console.log('data',data);

            api.postApi('get_user_id_list.php',data)
                  .then((res) => {
                    if(res.Result=='True'){

                        //console.log(res.data);
                        this.userList = res.data;
                        console.log('isdone==');
                        this.setState({loading:false,userList:this.userList}); 

                    }else{

                         this.setState({loading:false}); 
                    }
                   
            })
            .catch((e) => {

                console.log(e.message);
                     //alert(e.message);
                //this.refs.toast.show(e.message);
                this.setState({loading:false});

            })
    }

    gotoWallet(){

      this.closeModal();
      this.props.navigation.navigate("Wallet");
    }
    
    gotoLogin(){   

      this.closeModal();
      this.userData.loginforuce = true;
      helper.setCache('@userdata',this.userData);
      this.props.navigation.navigate("Login");
    }

    renderUserList1(){

        var pickerUserArray =[];
        pickerUserArray.push(<Picker.Item key='-1' value='-1' label='изберете потребител' />);

        if(this.state.userList.length>0){

            for(let data in this.state.userList){  

                if(this.state.userList[data].username!=this.state.secondname){


                    pickerUserArray.push(<Picker.Item key={data} value={this.state.userList[data].username} label={this.state.userList[data].username} />);
                }
                
            }

        }

        return pickerUserArray;


    }

    renderUserList2(){

        var pickerUserArray1 =[];
        pickerUserArray1.push(<Picker.Item key='-1' value='-1' label='изберете потребител' />);

        if(this.state.userList.length>0){

            for(let data in this.state.userList){  


                if(this.state.userList[data].username!=this.state.firstname){
                   
                    pickerUserArray1.push(<Picker.Item key={data} value={this.state.userList[data].username} label={this.state.userList[data].username} />);
                }
            }

        }

        return pickerUserArray1;


    }
    @autobind
    gotoShop() {  
        console.log('gotoshop');
           this.props.navigation.navigate("Wallet",{type:'vp'});
        //this.props.navigation.navigate("Wallet");
        //NavigationHelpers.reset(this.props.navigation, "Wallet");
    }

    @autobind
    checkToken() {
        console.log('gotoshop');
        Keyboard.dismiss()
        if(this.state.user_id!=0){

              
             if(Number(this.state.duel_token)<=Number(this.state.token)){

                  this.addDuel();
           

              }else{

                 Alert.alert(
                    "You don't have enough VP.",
                    'would you like to buy more?',
                    [
                      {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: 'Yes', onPress: () => this.gotoWallet()},
                    ],
                    { cancelable: false }
                  )

              }

        }else{

             Alert.alert(
              'Guest Account.',
              'PLease login',
              [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => this.gotoLogin()},
              ],
              { cancelable: false }
            )

        }
       
       
    }

    @autobind
    addDuel() {

        

        try {
             


             this.setState({modalVisible:false});
             var firstname = this.state.firstname;
             var secondname = this.state.secondname;
             var firstphoto = this.state.firstphoto;
             var secondphoto = this.state.secondphoto;
             var duel_token = this.state.duel_token;
            
            if(firstname==''){

                this.refs.toast.show('Please provide firstname');

             }else if(secondname==''){

                this.refs.toast.show('Please provide secondname');

             }else if(firstphoto==''){

                this.refs.toast.show('Please provide firstphoto');

             }else if(secondphoto==''){

                this.refs.toast.show('Please provide secondphoto');

             }else if(duel_token==''){

                this.refs.toast.show('Please provide dueltoken');

             }else{

               this.setState({isLoading:true});
                
                let data;  

                    console.log('firstphoto===',firstphoto,'secondphoto====',secondphoto);
                    let imagedata1 = ''
                    let imagedata2 = ''
                   
                    if(firstphoto.split('http://').length>1){
                     
                      imagedata1 =firstphoto.split('/')[firstphoto.split('/').length-1];

                    }else{

                      imagedata1 ={
                        uri:firstphoto,
                        name:'profile.jpg',
                        type:'image/jpg'      
                      }
                    }

                    if(secondphoto.split('http://').length>1){

                      imagedata2 =secondphoto.split('/')[secondphoto.split('/').length-1];

                    }else{

                      imagedata2 ={
                        uri:secondphoto,
                        name:'profile1.jpg',
                        type:'image/jpg'
                      }  
                    }

                    data ={    
                        user_id:this.userData.user_id,
                        firstname:firstname,
                        secondname:secondname,
                        firstphoto:imagedata1,
                        secondphoto:imagedata2,
                        duel_token:duel_token
                       
                    }     

                    console.log('adddual===',data);      
                
                api.postApi('add_duel_service.php',data)
                  .then((res) => {

                    console.log(res);
                    this.setState({isLoading:false});

                    if(res.Result=='True'){    


                        this.userData.tokens=Number(this.state.token)-Number( this.state.duel_token);    
                        console.log(this.userData.tokens);
                        helper.setCache('@userdata',this.userData);

                        const { navigation } = this.props;
                        
                        console.log(navigation.state.params);
                        let data ={
                            user_id:this.userData.user_id
                        }
                        console.log(data);
                        this.props.fetchDuelList('duel_list_service.php',data);
                        navigation.goBack();
                        //navigation.state.params.onSelect({ selected: true });

                    }else{

                        this.refs.toast.show(res.ResponseMsg);
                        
                    }

                    
                    
                  })
                  .catch((e) => {
                    // alert(e.message);
                     this.refs.toast.show(e.message);
                     this.setState({isLoading:false});
                  })


             }  

             

        } catch(e) {
            this.setState({isLoading:false});     
            this.refs.toast.show(e.message);   
        } 
    }
    
     @autobind
    getSecondImage(){
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

            console.log('response==',response);
            if(response.didCancel){

            }else if(response.error){

              this.refs.toast.show(response.error);

            }else if(response.customButton){
    
            }else if(response.fileSize){   

                var fileSize = Number(response.fileSize)/1000000;
                if(fileSize<1){
   
                    console.log('mb==',fileSize);
                    console.log('kb==',Number(response.fileSize)/1000);
                    this.setState({secondphoto:response.uri});
                }else{

                  this.refs.toast.show('image less than 1 mb');
                }
                
            }
        })

       
    }

     @autobind
    getFirstImage(){
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

        console.log('options==',options);
        ImagePicker.showImagePicker(options,(response) =>{

            console.log('response==',response);
            if(response.didCancel){

            }else if(response.error){

               this.refs.toast.show(response.error);

            }else if(response.customButton){

            }else if(response.fileSize){

                var fileSize = Number(response.fileSize)/1000000;
                if(fileSize<1){

                    console.log('mb==',fileSize);
                    console.log('kb==',Number(response.fileSize)/1000);
                    this.setState({firstphoto:response.uri});
                }else{

                  this.refs.toast.show('image less than 1 mb');
                }
                
            }
        })

       
    }

    selectStateFirstObject(itemValue, itemIndex){

       // console.log(itemValue, itemIndex,this.state.userList[itemIndex-1]);
       if(itemIndex>0){
        
           var itemIndex1 = Number(itemIndex)-1;
           this.setState({firstphoto:this.state.userList[itemIndex1].photo,firstname:itemValue})
       }
       
    }

    selectStateSecondObject(itemValue, itemIndex){

        //console.log(itemValue, itemIndex);
         
         if(itemIndex>0){
                
                var itemIndex2 = Number(itemIndex)-1;
                console.log('itemIndex2',itemIndex2);
                this.setState({secondphoto:this.state.userList[itemIndex2].photo,secondname:itemValue})
         }
              
    }


    props: {
        navigation: NavigationScreenProp<*, *>
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    render(): React$Element<*> {
      const {loading,jsonData,token} = this.state;
        if (loading) {

            return <Container>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Добавете Дуел</Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView style={{ backgroundColor: "white", flex: 1 }} >
                    
                     <View style={ Styles.flex }>
                      <ActivityIndicator
                        animating={ loading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>

                </ScrollView>
                <Toast ref="toast"/> 
            </Container>;

        }else{

            return <Container>
         <Image source={Images.login} style={style.img} >
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Добавете Дуел</Title>
                </Body>
                <Right />
            </Header>
            <ScrollView style={style.imgMask} >
            <View style={{ flex: 1, flexDirection:'row' }}>
                <View style={{ flex: 1, backgroundColor: '#635DB7', height: 200 }}>
                                {this.state.user_id!=0&&<Picker
                                  iosHeader="Select one"
                                  mode="dropdown"
                                  selectedValue={this.state.firstname}
                                  onValueChange={(itemValue, itemIndex) => this.selectStateFirstObject(itemValue, itemIndex)}
                                  
                                >
                                  {this.renderUserList1()}
                                </Picker>}
                    {this.state.user_id==0&&<TextInput placeholder="Name"
                      style={{height: 60, paddingLeft:10, width:'100%'}}
                      onChangeText={(firstname) => this.setState({firstname})}
                     
                    />}
                    
                    <Col style={{ justifyContent: 'center', alignItems: 'center' }}>  
                       
                        <TouchableOpacity onPress={this.getFirstImage}>
                         {this.state.firstphoto!=''&&<Image source={{uri:this.state.firstphoto}} style={{width:100,height:100, justifyContent: 'center', alignItems: 'center'}}/>}
                        {this.state.firstphoto==''&&<Avatar size={100} style={{ justifyContent: 'center', alignItems: 'center'}}/>}

                         </TouchableOpacity>
                        
                    </Col>
                </View>     
                <View style={{ flex: 1, backgroundColor: '#00CE9F', height: 200 }}>
                            {this.state.user_id!=0&&<Picker
                                  iosHeader="Select one"
                                  mode="dropdown"
                                  selectedValue={this.state.secondname}
                                  onValueChange={(itemValue, itemIndex) => this.selectStateSecondObject(itemValue, itemIndex)}
                                >
                                  {this.renderUserList2()}
                                </Picker>}
                             {this.state.user_id==0&&<TextInput placeholder="Name"
                      style={{height: 60, paddingLeft:10, width:'100%'}}
                      onChangeText={(secondname) => this.setState({secondname})}
                     
                    />}
                    <Col style={{ justifyContent: 'center', alignItems: 'center' }}>  
                         <TouchableOpacity onPress={this.getSecondImage}>
                         {this.state.secondphoto!=''&&<Image source={{uri:this.state.secondphoto}} style={{width:100,height:100, justifyContent: 'center', alignItems: 'center'}}/>}
                        {this.state.secondphoto==''&&<Avatar size={100} style={{ justifyContent: 'center', alignItems: 'center'}}/>}

                         </TouchableOpacity>
                    </Col>
                </View>
            </View>

            <Grid>
            <Col style={{ height: 100, justifyContent: 'center',
                alignItems: 'center' }}>  
                <Text style={{padding:20, borderRadius:100, backgroundColor: '#635DB7', color: '#fff', fontSize:20, fontWeight:'bold'}}>вп</Text>
            </Col>
            <Col style={{ padding:10, borderRadius:100, height: 100, justifyContent: 'center',
                alignItems: 'center' }}>
                <Text style={{padding:20, borderRadius:100, backgroundColor: '#00CE9F', color: '#fff', fontSize:20, fontWeight:'bold'}}>вп</Text>
            </Col>
          </Grid>
          <Grid>
            <Col style={{ height: 100, justifyContent: 'center',alignItems: 'center' }}>  
                <Text style={{color: 'red', fontSize:30, fontWeight:'bold'}}>Points</Text>
            </Col>
          </Grid>
  
            </ScrollView>
                <View style={{flexDirection:'row',flex: 1, backgroundColor: "rgba(71, 255, 247, .4)", justifyContent: 'space-between'}}>
                  <View><Text style={{ color: '#00CE9F', fontSize:22, padding:10, fontWeight:'bold'}}>вп : {this.state.token}</Text></View>
                <View>
                <Button transparent onPress={this.gotoShop} >
                    <Text ><Image source={Images.slot}/>
                    </Text>
                </Button>
                </View>
                </View>
            <Button primary full style={{ height: variables.footerHeight }} onPress={() => {
            this.setModalVisible(true);
          }}>
               {this.state.isLoading ? <Spinner color="white"/> : <Text style={{ color:'#fff' }}>запази</Text>} 
            </Button>

            <Modal 
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={{backgroundColor:'rgba(0,0,0,0.8)', height:'100%',justifyContent: 'center', alignItems: 'center'}} >
                <View style={{backgroundColor:'#fff', padding:25}}>
                  <Text style={{fontSize:18,padding:15}}>how much will you pay for this duel?</Text>
                  <TextInput style={{fontSize:18,padding:15}}
                    keyboardType={'phone-pad'}
                    placeholder="In VP's (eg:100)"
                    onChangeText={(duel_token) => this.setState({duel_token})}
                  />
                  <View style={{flexDirection:'row',justifyContent: 'center'}}>
                    <Button primary style={{margin:10}} onPress={() => this.checkToken()}>
                     <Text style={{color:'#fff', fontSize:18}}> Ok</Text>
                    </Button>
                   <Button primary style={{margin:10}}>
                     <Text style={{color:'#fff', fontSize:18}} onPress={() => this.closeModal()}> Cancel</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
            <Toast ref="toast"/>
            </Image> 
        </Container>;
        }
        
    }  
}

const mapStateToProps = state => {
  
  console.log('state.DuelReducer===',state.DuelReducer);
  return {
    duelList: state.DuelReducer.duelList,
    isFetching:state.DuelReducer.isFetching
  };
}

export default connect(mapStateToProps, {
  fetchDuelList,
})(Adddual);

const style = StyleSheet.create({
 heading: {
        marginTop: variables.contentPadding * 2,
        color: "white"
    },
      date:{
    flexDirection: 'row',
    height:550
  },
  rating:{
    textAlign:'center', 
    margin:12
  },
ratinginner:{
    alignItems: 'center', 
    justifyContent: 'center',
    width:60, 
    height:60, 
    textAlign:'center',
    padding:20,
    borderRadius: 100
  },
  ratingtext:{
    color:'#fff',
    fontSize:16
  },
          img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
            imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)"
    }
});