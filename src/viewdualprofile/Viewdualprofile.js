// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet, KeyboardAvoidingView, ScrollView ,Text, TextInput,Picker,ActivityIndicator,TouchableOpacity,Modal,Alert,Keyboard} from "react-native";
import {H1} from "native-base";
import {Container, Button, Header, Left, Right, Body, Icon, Title, Spinner, List} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import { Col, Row, Grid } from 'react-native-easy-grid';
import {BaseContainer, Avatar, TaskOverview, Small, Styles, Task, Field, NavigationHelpers, Images, WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";
import Swiper from 'react-native-swiper';

import {
  fetchDuelList,
} from "../actions/DuelAction";
import { connect } from "react-redux";     

export  class Viewdualprofile extends Component {

    constructor(props) {
        
        super(props);

        let param = this.props.navigation.state.params.data;
       // console.log('===param==param',param);

        this.state = {
          loading: true,
          duelList:'',
          jsonData:'',
          key:Number(this.props.navigation.state.params.data.key),
          selectuserkey:Number(this.props.navigation.state.params.data.key),
          duel_id:param.duel_id,
          firstbuttonLoading:false,
          secondbuttonLoading:false,
          loadingVisible: false,
          allduallist:[],
          modalVPVisible:false    
        }

        console.log(this.state);

       
    }

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            //console.log(res);
            if(res){

                this.userData = JSON.parse(res);

                this.setState({token:this.userData.tokens,modalVPVisible:false}); 
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
            var res = this.props.duelList;
            console.log('viewdual profile',res);
            if(res.Result=='True'){

                        //console.log(res.data);
                        this.dualList = res.data;
                        this.tempDualList=[];
                        var count =0;

                        // for(var dual in this.dualList){

                        //    if(this.dualList[dual].duel_id==this.state.duel_id){

                        //       this.tempDualList.push(this.dualList[dual]);
                        //       this.state.selectuserkey = dual;
                        //    }
                        // }

                        // for(var dual in this.dualList){

                        //     if(this.dualList[dual].duel_id!=this.state.duel_id&&count<20){

                        //       this.tempDualList.push(this.dualList[dual]);
                        //       this.state.selectuserkey = dual;
                        //       count=count+1;  
                        //     }
                        // }     

                        this.tempDualList = this.dualList;
                        console.log('temp===',this.tempDualList);       
                       // this.state.selectuserkey =0;    
                       // this.state.key =0;     
                        this.setState({loading:false,allduallist:this.tempDualList,jsonData:this.tempDualList[this.state.selectuserkey]}); 

                    }else{

                         this.setState({loading:false}); 
                    }
    }


   

    @autobind
    back() {
        this.props.navigation.goBack();
        //this.props.navigation.state.params.data.onSelect({ selected: true });
    }

    @autobind    
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    // @autobind
    // liveScore() {

    //     this.state.jsonData.selectuserkey = Number(this.state.selectuserkey)+1
    //     this.props.navigation.navigate("Livescore",this.state.jsonData);
    // }
   
   
   liveScore(item,index){   

      console.log('token==',this.tempDualList[index]);
      this.props.navigation.navigate("Livescore",this.tempDualList[index]);
   }

    closeVPModal() {

      this.setState({modalVPVisible:false});

    }

    updateDualToken(){

            console.log(this.currentItem);
            console.log(this.currentIndex);

            let data ={
                user_id:Number(this.userData.user_id),
                duel_id:Number(this.currentItem.duel_id),
                add_token:Number(this.state.duel_token)
            }

            this.setState({loading:true});  

            api.postApi('add_vp_token.php',data)
                  .then((res) => {
                    if(res.Result=='True'){

                        console.log('response========',res);
                       this.tempDualList[this.currentIndex].duel_tokens = Number(this.tempDualList[this.currentIndex].duel_tokens)+Number(this.state.duel_token);
                       this.userData.tokens=Number(this.userData.tokens)-Number( this.state.duel_token);    
                        console.log(this.userData.tokens);
                        helper.setCache('@userdata',this.userData);
                      console.log('this.dualList[this.currentIndex]=======',this.dualList[this.currentIndex]);


                    }else{

                         
                    }

                    
                    this.setState({loading:false,allduallist:this.tempDualList}); 

            })
            .catch((e) => {

                // this.dualList[this.currentIndex].duel_tokens = Number(this.dualList[this.currentIndex].duel_tokens)+Number(this.state.duel_token);
                  //  console.log('this.dualList[this.currentIndex]=======',this.dualList[this.currentIndex]);
                    this.setState({loading:false,allduallist:this.tempDualList}); 
            })   

    }

    @autobind
    checkToken() {
        console.log('gotoshop');
        Keyboard.dismiss()
        if(this.state.user_id!=0){

              console.log('check token-==',this.userData.tokens);
             if(Number(this.state.duel_token)<=Number(this.userData.tokens)){

                  //this.addDuel();
                  console.log('add dual list=====');
                  this.closeVPModal();
                  this.updateDualToken();


              }else{

                 this.closeVPModal();
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


 
    gotoShop(item,index) {

        console.log('item=====',item);
        this.currentItem = item;
        this.currentIndex= index;
        this.setState({modalVPVisible:true});

        // console.log('gotoshop');
        //             Alert.alert(
        //       'how munch vp the user wants to pay',
        //       'Do you want buy more?',
        //       [
        //         {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //         {text: 'Yes', onPress: () => this.props.navigation.navigate("Wallet",{type:'vp'})},
        //       ],
        //       { cancelable: false }
        //     )
        //this.props.navigation.navigate("Wallet");
        //NavigationHelpers.reset(this.props.navigation, "Wallet");
    }

    gotoWallet(){   

      this.props.navigation.navigate("Wallet",{type:'vp'});
    }

    voteAction(type,item,index){
  
            if(this.dualList[index].duel_tokens>0){

                console.log(item);
            let data ={
                user_id:this.userData.user_id,
                is_first_second:type,
                duel_id:item.duel_id
            }

           // alert(JSON.stringify(data));
            this.setState({loadingVisible:true});
            console.log('data=s=',data);

            api.postApi('add_duel_vote_service.php',data)
                  .then((res) => {

                    if(res.Result=='True'){
                       
                        if(type=='F'){

                          this.tempDualList[index].firstvotes=Number(this.tempDualList[this.state.selectuserkey].firstvotes)+1;

                        }else{

                          this.tempDualList[index].secondvotes=Number(this.tempDualList[this.state.selectuserkey].secondvotes)+1;
                        }
                        
                        this.tempDualList[index].duel_tokens = Number(this.tempDualList[index].duel_tokens)-1;

                       // var decreasetoken = Number(this.state.token)-1;
                        this.userData.tokens = Number(this.userData.tokens)+1;

                        console.log('this.userData.token===',this.userData);

                        helper.setCache('@userdata',this.userData);
                        this.refs.toast.show('One token increased your wallet');
                        this.setState({loadingVisible:false,secondbuttonLoading:false,jsonData:this.tempDualList[this.state.selectuserkey]}); 

                       // this.refs.toast.show(res.ResponseMsg);

                    }else{
   
                         this.refs.toast.show(res.ResponseMsg);
                         this.setState({loadingVisible:false,secondbuttonLoading:false}); 
                    }
                   
            })
            .catch((e) => {

                     //alert(e.message);
                this.refs.toast.show(e.message);
                this.setState({loadingVisible:false,secondbuttonLoading:false,loading:false});

            })
            }else{

              this.refs.toast.show('dont have duel token');
            }
            

    }

    render(): React$Element<*> {


        const {loading,jsonData,token} = this.state;
         let that =this;

         if(loading) {

             return <Container>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body> 
                        
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
            
            <Swiper style={style.wrapper}  index={this.state.key} showsButtons={false} showsPagination={false}>
                  {this.state.allduallist.map((item, key) => {
                      return (
              <View key="{key}" style={{marginBottom:10,flex:1}}>
                <Header noShadow>
                  <Left>
                      <Button onPress={that.back} transparent>
                          <Icon name='close' />
                      </Button>
                  </Left>
                  <Body>
                      <Title>DUEL:{Number(key)+1}</Title>
                  </Body>
                  <Right />
                </Header>
                <ScrollView style={style.imgMask} >
               <Grid style={{marginTop:20}}>
              
              <Col style={{ backgroundColor: '#635DB7', height: 180,justifyContent: 'center',
                  alignItems: 'center', marginTop:10}}>

                <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  
                </View>
                {item.firstphoto!=''&&<Image style={{width:140,height:140}} source={{uri:item.firstphoto}} />}
                {item.firstphoto==''&&<Avatar size={140}/>}
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>{item.firstname}</Text>
                
              </Col>
              <Col style={{ backgroundColor: '#00CE9F', height: 180, justifyContent: 'center',
                  alignItems: 'center', marginTop:10}}>
                  <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  
                </View>
                 {item.secondphoto!=''&&<Image style={{width:140,height:140}} source={{uri:item.secondphoto}} />}
                {item.secondphoto==''&&<Avatar size={140}/>}
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>{item.secondname}</Text>
                
              </Col>
                   
            </Grid>

            {item.duel_tokens>0&&<Grid>
                <Col style={{ justifyContent: 'center',alignItems: 'center'}}> 
                <List style={{ marginTop:20}}> 
                    <Button onPress={() => that.voteAction('F',item,key)} style={{borderRadius: 120}}>
                    {that.state.firstbuttonLoading ? <Spinner color="white" /> : <Text style={{color:'#fff'}}><Icon name="thumbs-up" /></Text>}
                    </Button>
                    <Text style={{ fontSize:20}}>Гласувай</Text>
                </List>
                </Col>
                <Col style={{ justifyContent: 'center',alignItems: 'center'}}>
                <List style={{ marginTop:20}}> 
                    <Button onPress={() => that.voteAction('S',item,key)} style={{backgroundColor:'#00CE9F', borderRadius: 120}}>
                    {that.state.secondbuttonLoading ? <Spinner color="white" /> : <Text style={{color:'#fff'}}><Icon name="thumbs-up" /></Text>}
                    </Button>
                    <Text style={{ fontSize:20}}>Гласувай</Text>
                </List>
                </Col>
            </Grid>}  

            <Grid >
                <Col style={{ justifyContent: 'center',alignItems: 'center'}}> 
                <List style={{ marginTop:20}}> 
                    <Button onPress={() => that.liveScore(item,key)} >
                    <Text style={{color:'#fff'}}>Резултати & коментар</Text>
                    </Button>
                </List>
                </Col>
            </Grid>

              <View style={style.imgMask1} >
                <View >  
                    <Text style={{color: '#00CE9F', fontSize:25, fontWeight:'bold', padding:15}}>вп : {item.duel_tokens}</Text>
                </View>

                                <Button transparent onPress={() => that.gotoShop(item,key)}  >
                    <Text ><Image source={Images.slot}/>
                    </Text>
                </Button>
                
              </View>      
              
            

            </ScrollView>
              </View>
            
            )
                  })}
            </Swiper>

            <Modal
              visible={this.state.loadingVisible}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => this.closeModal()} >
                <View style={{flex:1,flexDirection:'column',justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)',}}>
                    <Spinner color="#fff" />
                </View>

              
          </Modal>

            <Modal   
              animationType="slide"
              transparent={true}
              visible={this.state.modalVPVisible}
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
                     <Text style={{color:'#fff', fontSize:18}} onPress={() => this.closeVPModal()}> Cancel</Text>
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
    return {
    duelList: state.DuelReducer.duelList,
    isFetching:state.DuelReducer.isFetching
  };
}

export default connect(mapStateToProps, {
  fetchDuelList,
})(Viewdualprofile);

const style = StyleSheet.create({
    circle: {
        backgroundColor: "white",
        height: 125,
        width: 125,
        borderRadius: 62.5,
        justifyContent: "center",
        alignItems: "center"
    },
        img: {

        resizeMode: "cover",
        ...WindowDimensions
    },
            imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)"
    },

    imgMask1:{
      flexDirection:'row', 
      justifyContent: 'space-between',
      marginTop:20
    }
});
