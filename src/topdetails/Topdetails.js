 // @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet,Dimensions, KeyboardAvoidingView, ScrollView , TouchableOpacity,Text, Picker,ActivityIndicator, Modal, List} from "react-native";
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
const {width} = Dimensions.get("window");

import {
  fetchRankListService,
} from "../actions/UserRankAction";
import { connect } from "react-redux";

export  class TopDetails extends Component {

    constructor(props) {
        
        super(props)
        this.state = {
          loading: true,
          selectuserkey:Number(this.props.navigation.state.params.key),
          name:this.props.navigation.state.params.name,
          userid:this.props.navigation.state.params.userid,
          currentuserid:this.props.navigation.state.params.currentuserid,
          type:this.props.navigation.state.params.type,
          userList:[],
          rating1:false,
          rating2:false,
          rating3:false,
          rating4:false,
          loadingVisible: false,
          
        }
        this.ratingArray =[];
        
       console.log('key====',this.props.navigation.state.params.key);
    }




    props: {
        navigation: NavigationScreenProp<*, *>
    }

    componentWillMount() {

       
        helper.getCache('@userdata').then((res) => {

           
            if(res){

                this.userData = JSON.parse(res);

                this.setState({token:this.userData.tokens}); 
                this.getData(this.props.rankList);
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })
        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
    }


    componentWillReceiveProps(nextProps) {
      // If isAFavourite is toggled, update it
      if (nextProps.rankList !== this.props.rankList) {

                var res = nextProps.rankList;

                  if(res.Result=='True'){

                       // alert(JSON.stringify(res.data));
                        
                        console.log('render rank list=====',res);   
                        this.getData(nextProps.rankList);
                        

                    } 


      }    

    }

    @autobind
    back() {

        console.log('onback one==');
        this.props.navigation.goBack();   
    }

    @autobind
    signIn() {

        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    
    gotoShop = () => {       
       
        this.props.navigation.navigate("Wallet",{ updateToken: this.updateToken,type:'vp' });
        //NavigationHelpers.reset(this.props.navigation, "Wallet");
    }

        @autobind
    livescore() {  

        this.state.jsonData.selectuserkey = Number(this.state.selectuserkey)+1;
        console.log('live scroe===',this.state.jsonData);
        this.props.navigation.navigate("Livescore",this.state.jsonData);
    }

    updateToken = data => {

        // helper.getCache('@userdata').then((res) => {

        //         console.log(res);
        //         if(res){

        //             this.userData = JSON.parse(res);
        //             this.setState({'token':this.userData.tokens})
                    
                    
        //         }
               
        //     })
    }

    
    getData(res){


            //var res = this.props.rankList
            this.state.selectuserkey  = this.props.navigation.state.params.key;
            this.setState({selectuserkey:this.state.selectuserkey});    
            
            console.log('thispropes==================',res,'this.state.type==',this.state.type,'this.state.selectuserkey==',this.state.selectuserkey,'props==',this.props.navigation.state.params.key);
                    if(res.Result=='True'){
                        
                        this.userList = res.data;
                        var userData;

                        if(this.state.type=='ranklist'){

                            for(var data1 in this.userList){

                                this.userList[data1].avg_rating = parseFloat(Math.round((this.userList[data1].avg_rating)*100)/100).toFixed(2);
                            }

                            var checkarray = [];
                            var newList =[];
                            var count = 0;
                            var tempList=[];

                            for(let data in this.userList){

                                
                                if(checkarray.indexOf(this.userList[data].user_id)==-1){

                                    
                                    newList.push(this.userList[data]);

                                }

                                if(this.state.selectuserkey==data&&tempList.length==0){
                                    
                                    checkarray.push(this.userList[data].user_id);
                                    tempList.push(this.userList[data]);    
                                } 
                            }    


                            for(let data in newList){

                                if(count<999&&checkarray[0]!=newList[data].user_id){   

                                    count = count+1;

                                    checkarray.push(newList[data].user_id);
                                    tempList.push(newList[data]);    
                                }
                            }

                            this.setState({userList:tempList,loading:false,jsonData:userData,selectuserkey:0}); 

                        }else{   

                             var checkarray = [];
                            var newList =[];

                            for(let data in this.userList){

                                
                                if(checkarray.indexOf(this.userList[data].user_id)==-1){

                                    checkarray.push(this.userList[data].user_id);
                                    newList.push(this.userList[data]);
                                }
                            }
                            
                            this.setState({userList:newList,loading:false,jsonData:res.data[this.state.selectuserkey]}); 
                        }

                        

                    }else{

                         this.setState({loading:false}); 
                    }
                   
           
    }

    gotoProfile = (index) => {  

        console.log('index==',this.state.userList,index);
        this.props.navigation.navigate('Profile',{'current_id':this.state.userList[index].user_id,photo:this.state.userList[index].photo,username:this.state.userList[index].username,vp_tokens:this.state.userList[index].vp_tokens});
    }

    ratingAction = (number,item,index,action) => {

            console.log(this.state.token,action);

             if(Number(this.state.token)>=Number(action)){

                let data ={
                    user_id:this.state.currentuserid,
                    to_user_id:item.user_id,
                    rating:number
                }

                this.setState({loadingVisible:true});
                this.ratingArray.push(item.user_id);   

              

                api.postApi('user_rating_service.php',data)
                      .then((res) => {

                        console.log('rews===',res);

                        if(res.Result=='True'){


                            // this.state.jsonData.number_of_user=Number(this.state.jsonData.number_of_user)+1;
                            // this.state.jsonData.rating=Number(this.state.jsonData.rating)+Number(number);
                            // this.state.jsonData.avg_rating=(Number(this.state.jsonData.rating)/Number(this.state.jsonData.number_of_user));
                            // this.state.jsonData.avg_rating = this.state.jsonData.avg_rating.toFixed(2);

                            this.userList[index].number_of_user=Number(this.userList[index].number_of_user)+1;
                            this.userList[index].rating=Number(this.userList[index].rating)+Number(number);
                            this.userList[index].avg_rating=(Number(this.userList[index].rating)/Number(this.userList[index].number_of_user));
 
                            this.userList[index].avg_rating = parseFloat(Math.round((this.userList[index].avg_rating)*100)/100).toFixed(2);
                            var token = Number(this.state.token)-1;
                            this.setState({userList:this.userList,loadingVisible:false,token:token,rating1:false,rating2:false,rating3:false,rating4:false});

                            this.userData.tokens=token;
                            
                            helper.setCache('@userdata',this.userData);
                            this.refs.toast.show(res.ResponseMsg);

                            //console.log(this.state.jsonData);
                        }else{

                            this.setState({userList:this.userList,loadingVisible:false,rating1:false,rating2:false,rating3:false,rating4:false});
                            this.refs.toast.show(res.ResponseMsg);
                        }

                        
                       
                })
                .catch((e) => {

                         //alert(e.message);
                    this.refs.toast.show(e.message);
                    this.setState({rating1:false,rating2:false,rating3:false,rating4:false});
                    this.setState({loadingVisible:false});

                })
            }else{

                this.refs.toast.show('dont have vp token');
            }
            
    }

    render(): React$Element<*> {

        const {name, loading,rating1,rating2,rating3,rating4} = this.state;
       
        let that =this;

        if (loading) {

            return <Container style={{backgroundColor:'#fff'}}>
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

            return <Container style={{backgroundColor:'#fff'}}>

               

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
                <ScrollView>
                <TouchableOpacity style={{ flexDirection: 'row',  justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{ margin:5}} >
                        <Text style={{ fontSize:25}}>вп: {item.rating}/{item.number_of_user}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin:5}} >
                        <Text style={{ fontSize:25}}>Рейтинг: {item.avg_rating}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
                <Image source={Images.timeline} style={style.header}>
                    <TouchableOpacity style={[Styles.imgMask,style.date ]}>
 
                    <TouchableOpacity style={{width: 200, paddingTop:20, flex: 1, alignItems: 'center', height:300}} >
                        <ScrollView>
                        <TouchableOpacity  onPress={() => that.gotoProfile(index)} >
                            {item.photo!=''&&<Image style={{width:300,height:300, marginBottom:20}} source={{uri:item.photo}}/>}
                            {item.photo==''&&<Avatar size={250}/>}
                        </TouchableOpacity> 
                       
  
                        </ScrollView>
                    </TouchableOpacity>

                    </TouchableOpacity>
                </Image>
                <TouchableOpacity style={{ flexDirection:'row', backgroundColor:'#fff', justifyContent: 'center'}}>
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('+10',item,index,10)} style={style.ratinginner} >
                         <Image style={{width:45,height:45}} source={Images.star}>
                        {rating1 ? <Spinner color="white"/> : <Text style={style.ratingtext} >+10</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('+5',item,index,5)} style={style.ratinginner}>
                        <Image style={{width:45,height:45}} source={Images.gun}>
                         {rating2 ? <Spinner color="white"/> : <Text style={style.ratingtext}> +5</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('-5',item,index,5)} style={style.ratinginner}>
                        <Image style={{width:45,height:45}} source={Images.danger}>
                        {rating3 ? <Spinner color="white"/> : <Text style={style.ratingtext}> -5</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                    <TouchableOpacity style={style.rating} >
                        <Button primary onPress={() => that.ratingAction('-10',item,index,10)} style={style.ratinginner}>
                        <Image style={{width:50,height:50}} source={Images.bomb}>
                        {rating4 ? <Spinner color="white" /> : <Text style={style.ratingtext}> -10</Text>} 
                        </Image>
                        </Button>
                    </TouchableOpacity> 
                </TouchableOpacity>
                                




                </ScrollView>



                <View style={style.imgMask1} >
                <View >  
                    <Text style={{color: '#00CE9F', fontSize:25, fontWeight:'bold', padding:15}}>вп : {that.state.token}</Text>
                </View>
                 
                 
                <Button transparent >
                <TouchableOpacity  onPress={() => that.gotoShop()} >
                    <Text ><Image source={Images.coinbag} style={{width:100, height: 100}}/>
                    </Text>
                    </TouchableOpacity>
                </Button>
                
                
              </View>

                   

                </View>
              )
        })
    }   
                </Swiper>
                <Modal
              visible={this.state.loadingVisible}
              transparent={true}
              onRequestClose={() => this.closeModal()}>

            <TouchableOpacity style={{flex:1,flexDirection:'column',justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)',}}>
                    <Spinner color="#fff" />
                </TouchableOpacity>
          </Modal>
                <Toast ref="toast"/> 
            </Container>;
        }
        
    }
}



const mapStateToProps = state => {
  
  console.log('rank=======',state.UserRankReducer.rankList);
  return {
    rankList: state.UserRankReducer.rankList,
    isServiceFetching:state.UserRankReducer.isServiceFetching
  };
}

export default connect(mapStateToProps, {
  fetchRankListService,
})(TopDetails);

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