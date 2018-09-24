// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, ScrollView, Dimensions, ActivityIndicator, Modal, TouchableOpacity} from "react-native";
import {H1,Container, Button, Header, Left, Right, Body, Icon, Title,Spinner} from "native-base";
import { WebView } from "react-native";
import {BaseContainer, Styles, Images, Avatar, Task, WindowDimensions} from "../components";
import { Col, Row, Grid } from 'react-native-easy-grid';
import variables from "../../native-base-theme/variables/commonColor";

import Toast,{DURATION} from "react-native-easy-toast";



import api from '../Utils/api';
import helper from '../Utils/helper';

import PayPal from 'react-native-paypal-wrapper';

export default class Wallet extends Component {
    
    constructor(props) {
    super(props)

        var type = '';

        if(this.props.navigation.state.params){

            type = this.props.navigation.state.params.type;
        }

        this.state = {
          loading: false,
          token:0,
          pvp_tokens:0,
          vp100Coins:false,
          vp200Coins:false,
          vp500Coins:false,
          pvp1000Coins:false,
          pvp2000Coins:false,
          pvp5000Coins:false,
          sellLoading:false,
          loadingVisible: false,
          modalVisible: false,
          iswebview:false,  
          type:type

        }

       console.log('params====',this.state.type);
    }

    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            console.log(res);
            if(res){

                this.userData = JSON.parse(res);

                this.setState({loading:false,username:this.userData.user_name,token:this.userData.tokens,pvp_tokens:this.userData.pvp_tokens}); 
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })

        
   
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }
    
  selectCoin = (coin,coinname) => {

       this.purchaseCoin = coin;
       this.purchaseCoinName = coinname;
       this.openModal();
     
  }  

  sellPvp =() => {

            if(Number(this.state.pvp_tokens)>0){

                let data ={
                    user_id:this.userData.user_id,
                    number_of_token:Number(this.state.pvp_tokens),
                    token_type:'PVP'

                }

                this.setState({sellLoading:true})

                api.postApi('user_withdraw_service.php',data)
                      .then((res) => {

                       // console.log(res);
                        if(res.Result=='True'){
                            

                            this.setState({sellLoading:false,pvp_tokens:0}); 
                            this.refs.toast.show(res.ResponseMsg);

                        }else{

                             this.refs.toast.show(res.ResponseMsg);
                             this.setState({sellLoading:false}); 
                        }
                       
                })
                .catch((e) => {

                         //alert(e.message);
                    //this.refs.toast.show(e.message);
                    this.setState({sellLoading:false});

                })

            }else{

              this.refs.toast.show("do not have enough pvp amount");
            }
            

    }

    onMessage(event) {

      this.setState({iswebview:false});

      if(event.nativeEvent.data=='accept'){

          this.buyCoin( this.purchaseCoin,
       this.purchaseCoinName);

      }
    }

    paysera(){
     
      var orderid = new Date().getTime();
      orderid = this.state.username+"-"+orderid;
      console.log('orderid==',orderid);     
      this.setState({'url':'http://voxpopuliapp.com/payment/payment.php?orderid='+orderid+'&amount='+this.purchaseCoin})
      this.closeModal();
      this.setState({iswebview:true});   
    }

    paypal(){

      this.closeModal();
      PayPal.initialize(PayPal.SANDBOX,'AdC9zmsfwNJrjxSmm0bAajmjtFpG4WMG-6x8M2cWOmmSuWvfoqB2mUy-8e9Puf5zTeW57waiwNpiM2Ra');

      PayPal.pay({
        price:this.purchaseCoin,
        currency:'USD',
        description:this.purchaseCoinName
      }).then((confirm)=>console.log('payment done',confirm))
         .catch((error_code)=> console.log('failed to pay paypal'))

      // PayPalAndroid.paymentRequest({
      //   clientId:'AdC9zmsfwNJrjxSmm0bAajmjtFpG4WMG-6x8M2cWOmmSuWvfoqB2mUy-8e9Puf5zTeW57waiwNpiM2Ra',
      //   environment:PayPalAndroid.SANDBOX,
      //   price:'42.00',
      //   currency:'USD',
      //   description:'paypal test'
      // }).then((confirm,payment)=>console.log('paid'))
      //   .catch((error_code)=> console.error('failed to pay paypal'))
    }

    buyCoin(coin,coinname){

            let data ={
                user_id:this.userData.user_id,
                amount:coin,
                number_of_coin:coin,
                token_type:coinname

            }

            //console.log(data);
            var vptoken =Number(this.userData.tokens);
            var pvptoken = Number(this.userData.pvp_tokens);

            if(coin==100&&coinname=='VP'){
                //console.log('ininininin');

                vptoken = Number(this.userData.tokens)+Number(coin);
                //this.setState({vp100Coins:true})
            }
            else if(coin=='200'&&coinname=='VP'){

                vptoken = Number(this.userData.tokens)+Number(coin);
              //  this.setState({vp200Coins:true})
            }
            else if(coin=='500'&&coinname=='VP'){

                vptoken = Number(this.userData.tokens)+Number(coin);
               // this.setState({vp500Coins:true})
            }
            else if(coin=='1000'&&coinname=='PVP'){

                pvptoken = Number(this.userData.pvp_tokens)+Number(coin);
               // this.setState({pvp1000Coins:true})
            }
            else if(coin=='2000'&&coinname=='PVP'){

                pvptoken = Number(this.userData.pvp_tokens)+Number(coin);
               // this.setState({pvp2000Coins:true})
            }
            else if(coin=='5000'&&coinname=='PVP'){

                pvptoken = Number(this.userData.pvp_tokens)+Number(coin);
                //this.setState({pvp5000Coins:true})
            }
            
            this.setState({loadingVisible:true})
                   

            api.postApi('user_payment_service.php',data)
                  .then((res) => {

                    this.setState({vp100Coins:false,vp200Coins:false,vp500Coins:false,pvp1000Coins:false,pvp2000Coins:false,pvp5000Coins:false}); 
                    this.setState({loadingVisible:false})
                    if(res.Result=='True'){
                        
                        this.userData.tokens=vptoken;
                        this.userData.pvp_tokens=pvptoken;
                        helper.setCache('@userdata',this.userData);

                        this.setState({token:vptoken,pvp_tokens:pvptoken}); 
                        this.refs.toast.show(res.ResponseMsg);

                    }else{

                        this.refs.toast.show(res.ResponseMsg);
                    }
                   
            })
            .catch((e) => {
                    this.setState({loadingVisible:false})
                     //alert(e.message);
                //this.refs.toast.show(e.message);
                //this.setState({vp100Coins:false,vp200Coins:false,vp500Coins:false,pvp1000Coins:false,pvp2000Coins:false,pvp5000Coins:false}); 

            })
                
    }

    

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    render(): React$Element<*> {
        const screenHeight = Dimensions.get('window').height;

        if(!this.state.iswebview){

            return <Image source={Images.drawer} style={style.img}>
        <Container style={StyleSheet.flatten(style.container)}>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Buy Портфейл</Title>
                </Body>
                <Right />
            </Header>
            {this.state.iswebview==false&&<ScrollView>
            <View >

                <Grid>
                    <Col style={{  height: 400,alignItems: 'center'}}>  
                           
                           <Text style={{marginTop:10, marginBottom:20, width:70, height:70, borderRadius:100, 
                            backgroundColor: '#fff', color: '#635DB7', fontSize:20, paddingTop:20 , fontWeight:'bold', textAlign:'center'}}>вп</Text>
                            <Text style={{color:'#fff', fontSize:18}}>{this.state.token} жетони</Text>
                            
                            <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#00CE9F', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('100','VP')}>
                             {this.state.vp100Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 100 жетони</Text>}
                             
                            
                            </Button>

                            <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#00CE9F', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('200','VP')}>
                             {this.state.vp200Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 200 жетони</Text>}
                             
                            </Button>

                            <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#00CE9F', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('500','VP')}>
                            {this.state.vp500Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 500 жетони</Text>}
                             
                            </Button>
                    </Col>

                    {this.state.type!='vp'&&<Col style={{height: 400, alignItems: 'center'}}>
                        <Text style={{marginTop:10, marginBottom:20, width:70, height:70, borderRadius:100,
                          backgroundColor: '#fff', color: '#00CE9F',fontSize:20, paddingTop:20,
                          fontWeight:'bold', textAlign:'center'}}>пвп</Text>
                          <Text style={{color:'#fff', fontSize:18}}>{this.state.pvp_tokens} жетони</Text>
                          
                          <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#635DB7', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('1000','PVP')}>
                          {this.state.pvp1000Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 1000 жетони</Text>}
                          </Button>

                           <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#635DB7', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('2000','PVP')}>
                           {this.state.pvp2000Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 2000 жетони</Text>}  

                          </Button>

                          <Button style={{marginTop:10, marginBottom:10, marginLeft:40, width:120, height:70, backgroundColor: '#635DB7', borderRadius:5, paddingLeft:2 , 
                             paddingTop:5, justifyContent:'center', alignItems:'center'}} onPress={() => this.selectCoin('5000','PVP')}>
                          {this.state.pvp5000Coins ? <Spinner color="white" /> : <Text  style={{textAlign:'center',color:'#fff'}}  > 
                             <Image style={{width:65,height:70}} source={require('../components/images/avatars/pouch.png')}/> 5000 жетони</Text>}         
                          </Button>
                    </Col>}
                </Grid>

            </View>
            </ScrollView>  }

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

          <Modal
              visible={this.state.modalVisible}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => this.closeModal()}
          >
                <View style={{flex:1,flexDirection:'column',justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)',}}>

                          <View >                     
                          <Button style={{marginTop:10, marginBottom:10, width:200, height:50, backgroundColor: '#fff', borderRadius:5, paddingLeft:5 , 
                             paddingTop:10}} onPress={() => this.paypal()}>
                             <Image style={{width:35,height:35}} source={require('../components/images/avatars/paypal.png')} /> 
                             <Text style={{flex:1, marginTop:0, paddingTop:0, color:'#000', fontSize:20, paddingLeft:20}}>PayPal</Text>
                          </Button>
                          </View>
                          
                          <View >                     
                          <Button style={{marginTop:10, marginBottom:10, width:200, height:50, backgroundColor: '#fff', borderRadius:5, paddingLeft:5 , 
                             paddingTop:10}} onPress={() => this.paysera()}>
                            
                             <Image style={{width:35,height:35}} source={require('../components/images/avatars/bankcard.png')}/> 
                             <Text style={{flex:1, marginTop:0, paddingTop:0, color:'#000', fontSize:20, paddingLeft:20}}>Bank Card</Text>      
                          </Button>
                          </View>
                          
                          <TouchableOpacity  >                     
                          <Button style={{marginTop:10, marginBottom:10, width:200, height:50, backgroundColor: '#fff', borderRadius:5, paddingLeft:5 , 
                             paddingTop:10}} onPress={() => this.paysera()}>

                             <Image style={{width:35,height:35}} source={require('../components/images/avatars/sms.png')}/> 

                             <Text style={{flex:1, marginTop:0, paddingTop:0, color:'#000', fontSize:20, paddingLeft:20}}>SMS</Text>       
                          </Button>
                          </TouchableOpacity >
                </View>
          </Modal>

            <Toast ref="toast"/> 

             
    
             
            </Container>
            </Image>;
        }else{
  
          return <WebView
                  style={{ flex: 1 }}
                  source={{uri:this.state.url}}
                  ref={webView => (this.webView = webView)}
                  onMessage={this.onMessage.bind(this)}
               />
        }
        

            
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
        backgroundColor: "rgba(80, 210, 194, .5)"
    }
});