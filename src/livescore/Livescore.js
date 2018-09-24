// @flow
import moment from "moment";
import { Keyboard,ListView } from 'react-native'
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, ScrollView, Dimensions, ActivityIndicator, Modal, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import {H1,Container, Button, Header, Left, Right, Body, Icon, Title,Spinner, Item, Input, Form, List, ListItem, Thumbnail} from "native-base";

import {BaseContainer, Styles, Images, Avatar, Task, WindowDimensions} from "../components";
import { Col, Row, Grid } from 'react-native-easy-grid';
import variables from "../../native-base-theme/variables/commonColor";

import Toast,{DURATION} from "react-native-easy-toast";
import ProgressBarClassic from 'react-native-progress-bar-classic';

import api from '../Utils/api';
import helper from '../Utils/helper';


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
})

export default class Livescore extends Component {


  constructor(props) {
        
        super(props)
        this.state = {
          loading: true,
          user_id:'',
          commentList:[],
          duel_id:this.props.navigation.state.params.duel_id,
          firstphoto:this.props.navigation.state.params.firstphoto,
          secondphoto:this.props.navigation.state.params.secondphoto,
          firstvotes:this.props.navigation.state.params.firstvotes,
          secondvotes:this.props.navigation.state.params.secondvotes,
          firstvotepercentage:0,
          secondvotepercentage:0,
          firstname:this.props.navigation.state.params.firstname,
          secondname:this.props.navigation.state.params.secondname,
          selectuserkey:this.props.navigation.state.params.selectuserkey
        }   
        
        
       
        
       
        //this.state.firstvotepercentage = String(Math.round((Number(this.state.firstvotes)/Number(this.totalpercentage))*100))+"%";
        //this.state.secondvotepercentage = String(Math.round((Number(this.state.secondvotes)/Number(this.totalpercentage))*100))+"%";

        this.commentListData =[];

      // console.log('key====',this.state.firstvotepercentage,this.state.secondvotepercentage);
  }    
   
  componentWillMount() {

        
    helper.getCache('@userdata').then((res) => {

            console.log(res);
        if(res){

                this.userData = JSON.parse(res);

                this.setState({user_id:this.userData.user_id});
                this.setState({user_name:this.userData.user_name})
                console.log('thisuserdata===',this.userData);

                console.log('this.state.firstvotes=='+this.state.firstvotes);
                this.totalpercentage = (Number(this.state.firstvotes)+Number(this.state.secondvotes));
                
                if(this.totalpercentage>0){

                  console.log('this.totalpercentage===',this.totalpercentage);
                  this.setState({firstvotepercentage:String(Math.round((Number(this.state.firstvotes)/Number(this.totalpercentage))*100))+"%"})
                  this.setState({secondvotepercentage:String(Math.round((Number(this.state.secondvotes)/Number(this.totalpercentage))*100))+"%"})


                }else{

                  console.log('this.totalpercentage===',this.totalpercentage);
                this.setState({firstvotepercentage:String(0)+"%"})
                this.setState({secondvotepercentage:String(0)+"%"})

                }
                
   
                this.getData();
                
        }
           
    })
    //const userdata = await AsyncStorage.getItem('@userdata'); 
  }

   getData(){

            let data ={
                duel_id :this.state.duel_id
            }   

            var url ='';

            url = 'all_comment_service.php';

            console.log(data);
            api.postApi(url,data)
                  .then((res) => {

                    
                    console.log('okokok===',res);

                    if(res.Result=='True'){   
                      
                      
                      for(let c in res.data){

                        this.commentListData.push(res.data[c]);  
                      }

                      var new_arr = this.commentListData;
                      console.log('this.commentListData=====',new_arr);
                      
                      this.setState({commentList:ds.cloneWithRows(new_arr.reverse())})

                    }else{

                      this.setState({commentList:ds.cloneWithRows([])})
                    }

                    this.setState({loading:false}); 
                   
            })  
            .catch((e) => {  
              console.log(e);
                     //alert(e.message);
               //this.refs.toast.show(e.message);
               this.setState({commentList:ds.cloneWithRows([])})
                this.setState({loading:false});

            })
    }   

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }


  addComment(){
    console.log('thiss',this.userdata);
  
    if(this.state.comment!=''){

            let data ={
                duel_id :this.state.duel_id,
                user_id : this.state.user_id,
                comment:this.state.comment
            }
            console.log(this.commentListData);
            let commentData ={

                li_user_name:this.state.user_name,
                comment:this.state.comment
            }   

            console.log(this.commentListData);  

            this.commentListData.push(commentData);

             console.log(this.commentListData);
             

             var new_arr = this.commentListData;
            this.setState({comment:'',commentList:ds.cloneWithRows(new_arr.reverse())})

            var url ='';
            Keyboard.dismiss()   

            url = 'add_comment_service.php';

            console.log(data);
            api.postApi(url,data)
                  .then((res) => {
                    console.log(res);
                    this.setState({loading:false}); 
                    
                   
            })
            .catch((e) => {

                this.setState({loading:false});

            })

    }
  } 

    @autobind
    back() {
        this.props.navigation.goBack();

    }

    renderRow(rowData) {
    return (

                <List>
                  <ListItem avatar>
                    <Left>
                      <Avatar size={50} />
                    </Left>
                    <Body>
                      <Text>{rowData.li_user_name}</Text>
                      <Text note>{rowData.comment}</Text>
                    </Body>
                    <Right>
                      <Text note></Text>
                    </Right>
                  </ListItem>
                </List>
    )
  }  

    render(): React$Element<*> {
        const {loading} = this.state;
        const screenHeight = Dimensions.get('window').height;

        if (loading) {

            return <Container>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Дуел {this.state.selectuserkey}</Title>
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

            return <Image source={Images.drawer} style={style.img}>

        <Container style={StyleSheet.flatten(style.container)}>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>DUEL {this.state.selectuserkey}</Title>
                </Body>
                <Right />
            </Header>

            <ScrollView style={{ backgroundColor: "white" }} >
            
            <Grid>
              <Col style={{ backgroundColor: '#635DB7', height: 180,justifyContent: 'center',
                  alignItems: 'center'}}>
                <View style={{ flex:1, flexDirection:'row', height: 20}}>
                </View>
                 {this.state.firstphoto!=''&&<Image style={{width:140,height:140}} source={{uri:this.state.firstphoto}}/>}
                {this.state.firstphoto==''&&<Avatar size={140}/>}
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>{this.state.firstname}</Text>
              </Col>  
              <Col style={{ backgroundColor: '#00CE9F', height: 180, justifyContent: 'center',
                  alignItems: 'center'}}>
                  <View style={{ flex:1, flexDirection:'row', height: 20}}>
                </View>
                 {this.state.secondphoto!=''&&<Image style={{width:140,height:140}} source={{uri:this.state.secondphoto}}/>}
                {this.state.secondphoto==''&&<Avatar size={140}/>}
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>{this.state.secondname}</Text>
              </Col>
            </Grid>

            <Grid style={{justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{fontSize:20, marginTop:10}} >Резултати</Text>
            </Grid>

            <View style={{marginLeft:10, marginRight:10}}>
              <Grid>
                <Col style={{borderTopLeftRadius:10, borderBottomLeftRadius:10, backgroundColor: '#635DB7', height: 20,justifyContent: 'center',
                    alignItems: 'center', width:this.state.firstvotepercentage}}>
                  <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  </View>
                  <Text style={{ color:'#fff', fontSize:18, padding:10}}>{this.state.firstvotepercentage}</Text>
                </Col>

                <Col style={{borderTopRightRadius:10, borderBottomRightRadius:10, backgroundColor: '#00CE9F', height: 20, justifyContent: 'center',
                    alignItems: 'center', width:this.state.secondvotepercentage}}>   
                    <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  </View>
                  <Text style={{ color:'#fff', fontSize:18, padding:10}}>{this.state.secondvotepercentage}</Text>
                </Col>
              </Grid>
            </View>


              
            </ScrollView>

          </Container>


            
            <View style={{height:200}}>
     
                <ScrollView style={{backgroundColor:'#f1f1f1'}}>
                    <ListView
                      enableEmptySections={true}
                      dataSource={ this.state.commentList }
                      renderRow={ this.renderRow.bind(this) } />
                </ScrollView>

               

              </View>
              
              <KeyboardAvoidingView behavior='padding' 
                style={{backgroundColor:'#fff'}}>
                
                <Item>  

                  <Input  value={this.state.comment} onChangeText={(comment) => this.setState({comment})} placeholder='коментар' style={{height:70, paddingLeft:20}}/>
                  <Button transparent onPress={this.addComment.bind(this)}>
                    <Icon name='send' style={{fontSize:30, paddingTop:20}}/>
                  </Button>
                </Item>
              </KeyboardAvoidingView>
            </Image>;

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