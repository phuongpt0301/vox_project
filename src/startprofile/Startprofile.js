// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet,Dimensions, KeyboardAvoidingView, ScrollView , TouchableOpacity,Text, Picker,ActivityIndicator, Modal} from "react-native";
import {H1} from "native-base";
import {Container, Button, Header, Left, Right, Body, Icon, Title, Form,Item,Spinner} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import { Col, Row, Grid } from 'react-native-easy-grid';
import {BaseContainer, Avatar, Images, TaskOverview, Small, Styles, Task, Field, NavigationHelpers} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import Toast,{DURATION} from "react-native-easy-toast";
import Swiper from 'react-native-swiper';
import api from '../Utils/api';
import helper from '../Utils/helper';

import {
  fetchRankList,
} from "../actions/UserRankAction";
import { connect } from "react-redux";

const {width} = Dimensions.get("window");
export  class Startprofile extends Component {

    constructor(props) {
        
        super(props)
        this.state = {
          loading: true,
          name:'',
          userid:'',
          currentuserid:'',
          type:'',
          top_name:'',
          jsonData:{},
          userList:[],
          rating1:false,
          rating2:false,
          rating3:false,
          rating4:false,
          selectuserkey:0,
          loadingVisible: false,
          
        }      

        this.ratingArray=[];
    }

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    
   
    componentWillMount() {

        try{
   
             helper.getCache('@userdata').then((res) => {

           console.log('res======pppp',res);
            if(res){

                this.userData = JSON.parse(res);
                let data ={
                    user_id:this.userData.user_id
                }

                 console.log('this.userData====',this.userData);
                this.setState({tokens:this.userData.tokens})
                this.props.fetchRankList('get_user_id_list.php',data);   
                //this.getData(this.userData.user_id);
                
                
            }else{

                let data = {
                  'user_id':0,
                  'user_name':'guest',
                  'user_email':'guest@gmail.com',
                  'user_password':'password123#',
                  'user_phonenumber':'123456789',
                  'user_age':'15',
                  'user_country':'USA',
                  'city_town':'cam',
                  'pvp_tokens':0,
                  'top10':0,
                  'quiz':0,
                  'duel':0,
                  'totaltime':0,
                  'rating':0,
                  'number_of_user':0,
                  'photo':'',
                }
                
                let data1 ={
                    user_id:0
                }

                helper.setCache('@userdata',data);
                this.props.fetchRankList('get_user_id_list.php',data1);
            }
            
           
        })

        }catch(e) {
          console.log('start profile',e);           
        }
       
    }

    componentWillReceiveProps(nextProps) {
      // If isAFavourite is toggled, update it
      if (nextProps.userList !== this.props.userList) {

          var res = nextProps.userList;
          if(res.Result=='True'){
                        
                        var random = Math.floor(Math.random() * Math.floor(res.data.length-1));
                        this.userList = [];
                       // var userData;
                       var count =0;
                       for(let data in res.data){

                            if(data==random){

                                this.userList.push(res.data[data]);
                            }
                       }

                       for(let data in res.data){
                            
                            if(data!=random&&count<999){

                                count=count+1;
                                this.userList.push(res.data[data]);
                            }
                       }   

                       
                       for(var data in this.userList){ 

                                this.userList[data].avg_rating = parseFloat(Math.round((this.userList[data].avg_rating)*100)/100).toFixed(2);
                            }

                        
                       // console.log(this.userList);

                        this.setState({userList:this.userList});    
   
          }
      }

    }

    @autobind
    back() {
        
        NavigationHelpers.reset(this.props.navigation, "Main");
    }

    @autobind
    signIn() {

        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    @autobind
    gotoShop() {
        
        console.log('gotoshop');
        this.props.navigation.navigate("Wallet",{ updateToken: this.updateToken,type:'vp' });
        //NavigationHelpers.reset(this.props.navigation, "Wallet");
    }

   
    gotoProfile = (index) => {  

        console.log('index==',index,this.state.userList[index]);
        this.props.navigation.navigate('Profile',{'current_id':this.state.userList[index].id,photo:this.state.userList[index].photo,username:this.state.userList[index].username,vp_tokens:this.state.userList[index].vp_tokens});
    }
    

            

    ratingAction = (number,index,action) => {        

            console.log(this.state.tokens,action);

            if(Number(this.state.tokens)>=Number(action)){

                let data ={
                    user_id:this.userData.user_id,
                    to_user_id:this.state.userList[index].id,
                    rating:number
                }    

                this.ratingArray.push(this.state.userList[index].id);

                this.setState({loadingVisible:true});
               

                console.log(data);

                api.postApi('user_rating_service.php',data)
                      .then((res) => {

                        console.log('rews===',res);

                        if(res.Result=='True'){

                             this.refs.toast.show(res.ResponseMsg);

                            console.log(this.state.jsonData);

                            this.state.userList[index].number_of_user=Number(this.state.userList[index].number_of_user)+1;
                            this.state.userList[index].rating=Number(this.state.userList[index].rating)+Number(number);
                            this.state.userList[index].avg_rating=(Number(this.state.userList[index].rating)/Number(this.state.userList[index].number_of_user));
                                
                                   

                            this.state.userList[index].avg_rating = parseFloat(Math.round((this.state.userList[index].avg_rating)*100)/100).toFixed(2);
                            var token = Number(this.state.tokens)-1;
                            this.setState({userList:this.state.userList,loadingVisible:false,tokens:token,rating1:false,rating2:false,rating3:false,rating4:false});

                            this.userData.tokens=token;
                                
                            helper.setCache('@userdata',this.userData);

                        }else{

                            console.log('inininin=======================');
                            this.refs.toast.show(res.ResponseMsg);
                            this.setState({loadingVisible:false,rating1:false,rating2:false,rating3:false,rating4:false});
                           
                        }

                       


                      //  this.setState({jsonData:this.state.jsonData,loadingVisible:false,rating1:false,rating2:false,rating3:false,rating4:false});
                       
                })
                .catch((e) => {

                         //alert(e.message);
                    this.refs.toast.show(e.message);
                    this.setState({rating1:false,rating2:false,rating3:false,rating4:false,loadingVisible:false});
                    this.setState({loading:false});

                })
            }else{

                 this.refs.toast.show('dont have vp token');
            }
            
    }

    render(): React$Element<*> {

        const {name, loading,rating1,rating2,rating3,rating4} = this.state;
        
        let that =this;

        console.log('this is user list : ', this.state.userList)
        
        if (this.props.isFetching) {

            return <Container>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{name}</Title>   
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

            </Container>;

        }else{

            return <Container>


                 <Swiper style={style.wrapper}  index={this.state.selectuserkey} showsButtons={false} showsPagination={false}>
                   {this.state.userList.map(function(item,index) {

            return (
                <View key="{index}" style={{marginBottom:10}}>
                <Header noShadow>
                    <Left>
                        <Button onPress={that.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{item.username}</Title>
                    </Body>
                    <Right />
                </Header>

                <TouchableOpacity style={{ flexDirection: 'row',  justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{ margin:5}} >
                        <Text style={{ fontSize:25}}>вп: {item.rating}/{item.number_of_user}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin:5}} >
                        <Text style={{ fontSize:25}}>Рейтинг: {item.avg_rating}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>  
                
                <Image source={Images.timeline} style={style.header}>
                    <View style={[Styles.imgMask,style.date ]}>
                    
                    <View style={{width: 200, paddingTop:20, flex: 1, alignItems: 'center', height:300}} >
                        <ScrollView>
                        <TouchableOpacity  onPress={() => that.gotoProfile(index)} >
                        {item.photo!=''&&<Image style={{width:300,height:300, marginBottom:20}} source={{uri:item.photo}} />}
                        {item.photo==''&&<Avatar size={250} />}
                        </TouchableOpacity> 
                        </ScrollView>
                    </View>
                    
                    </View>  
                </Image>
                <View style={{  flexDirection:'row', backgroundColor:'#fff', justifyContent: 'center'}}>
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('+10',index,10)} style={style.ratinginner} >
                         <Image style={{width:45,height:45}} source={Images.star}>
                        {rating1 ? <Spinner color="white"/> : <Text style={style.ratingtext} >+10</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('+5',index,5)} style={style.ratinginner}>
                        <Image style={{width:45,height:45}} source={Images.gun}>
                         {rating2 ? <Spinner color="white"/> : <Text style={style.ratingtext}> +5</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('-5',index,5)} style={style.ratinginner}>
                        <Image style={{width:45,height:45}} source={Images.danger}>
                        {rating3 ? <Spinner color="white"/> : <Text style={style.ratingtext}> -5</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('-10',index,10)} style={style.ratinginner}>
                        <Image style={{width:50,height:50}} source={Images.bomb}>
                        {rating4 ? <Spinner color="white" /> : <Text style={style.ratingtext}> -10</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                </View>   
                </View>   

            )

        })
    }   
                </Swiper>

                

                            <Modal
              visible={this.state.loadingVisible}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => this.closeModal()}
          >
                <View style={{flex:1,flexDirection:'column',justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)',}}>
                    <Spinner color="#fff" />
                </View>

              
          </Modal>

                <Toast ref="toast"/> 
                <View style={style.imgMask1} >
                <View >  
                    <Text style={{color: '#00CE9F', fontSize:25, fontWeight:'bold', padding:15}}>вп : {this.state.tokens}</Text>
                </View>
                 
                <Button transparent onPress={this.gotoShop} >
                    <Text ><Image source={Images.coinbag} style={{width:100, height: 100}}/>
                    </Text>
                </Button>
                
              </View>
            </Container>;
        }
        
    }
}


const mapStateToProps = state => {
  
  
  return {
    userList: state.UserRankReducer.userList,
    isFetching:state.UserRankReducer.isFetching
  };
}

export default connect(mapStateToProps, {
  fetchRankList,
})(Startprofile);

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
    margin:12
  },
ratinginner:{
    alignItems: 'center', 
    justifyContent: 'center',
    width:60, 
    height:60, 
    padding:20,
    borderRadius: 100
  },
  ratingtext:{
    color:'#635DB7',
    fontSize:15,
    color:'#fff',
    marginTop:11,
    marginLeft:10,
    fontWeight:'bold',

  },
      imgMask1:{
      backgroundColor:'#fff',
      flexDirection:'row', 
      justifyContent: 'space-between',
    },
        header: {
        width,
        height: width * 440 / 480
    },
});