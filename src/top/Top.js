// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, TouchableOpacity, Footer,ActivityIndicator, ScrollView,Modal,Alert,Picker} from "react-native";
import {H1,H3, Button, Icon,Spinner} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import {BaseContainer, Styles, Images ,Avatar, WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Small from "../components/Small";

import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";

export default class Top extends Component {
   
    constructor(props) {
        super(props)

        this.state = {
          loading: true,
          top10:[],
          currentuserid:'',
          selectTop_id:0,
          loadingVisible: false,
          category:'All'
        }
  
    }


    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

           
            if(res){

                this.userData = JSON.parse(res);
                console.log(this.userData);
                this.getData(this.userData.user_id,this.state.category);
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })

        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
    }

    onSelect = data => {
       
        this.setState({loading:true});
        this.getData(this.userData.user_id);
   };

   

    getData(user_id,category){

            let data ={

            }
            console.log('this.state.category==',this.state.category);
            this.setState({loading:true}); 
            data ={
                    user_id:user_id,
                    category:category
                }
            
            console.log(data);
            api.postApi('top10_list_service.php',data)
                  .then((res) => {

                    console.log(res);
                    if(res.Result=='True'){
                        
                        for(let list in res.data){
                            res.data[list].voting=false;
                        }

                        this.setState({loading:false,top10:res.data,currentuserid:user_id}); 
                    }else{
                         this.setState({loading:false}); 
                    }
                   
            })
            .catch((e) => {

                     //alert(e.message);
                //this.refs.toast.show(e.message);
                this.setState({loading:false});

            })
    }

     @autobind
    go() {
        this.props.navigation.navigate('Addtop', { onSelect: this.onSelect });
    }

     @autobind
    inserttop10() {
        this.props.navigation.navigate('Addtop');
    }

    selectStateCategory(itemValue, itemIndex){

         if(itemIndex>0){
                
              
           this.setState({category:itemValue});
           this.getData(this.userData.user_id,itemValue);
         }

    }
    
    voteAction = (topid) => {

        this.setState({loadingVisible:true});
            let data ={
                user_id:this.userData.user_id,
                top_id:topid
            }

            //console.log(data);
            this.setState({selectTop_id:topid});

            api.postApi('add_top10_vote_service.php',data)
                  .then((res) => {

                    console.log(res);
                    if(res.Result=='True'){
                        this.refs.toast.show(res.ResponseMsg);
                        let top10data = this.state.top10;

                        for(let list in top10data){
                            
                            if(topid==top10data[list].top_id){

                                top10data[list].vp_tokens=Number(top10data[list].vp_tokens)+1;
                            }
                            
                        }

                        this.setState({top10:top10data});
                         
                    }else{

                         this.refs.toast.show(res.ResponseMsg);
                    }
                    this.setState({selectTop_id:0,loadingVisible:false});
                   
            })
            .catch((e) => {

                     //alert(e.message);
                this.refs.toast.show(e.message);
                this.setState({selectTop_id:0,loadingVisible:false});

            })
    }

    submitvote = (topid) => {

        console.log('submitvote===',topid);

        Alert.alert(
              'Confirm',
              'Are you sure to vote on this item?',
              [
                
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.voteAction(topid)},
              ],
              { cancelable: false }
            )

            
   

    }

    renderCategory(){

        var categoryArray =[];
        categoryArray.push(<Picker.Item key='-1' value='-1' label='Select Category' />);

        categoryArray.push(<Picker.Item key='0' value='Beauty' label='Beauty' />);
        categoryArray.push(<Picker.Item key='1' value='Books' label='Books' />);
        categoryArray.push(<Picker.Item key='2' value='Camera' label='Camera' />);
        categoryArray.push(<Picker.Item key='3' value='Cell' label='Cell' />);
        categoryArray.push(<Picker.Item key='4' value='Clothing' label='Clothing' />);
        categoryArray.push(<Picker.Item key='5' value='Electronics' label='Electronics' />);
        categoryArray.push(<Picker.Item key='6' value='Fashion' label='Fashion' />);
        categoryArray.push(<Picker.Item key='7' value='Art' label='Art' />);
        categoryArray.push(<Picker.Item key='7' value='Grocery' label='Grocery' />);
        categoryArray.push(<Picker.Item key='7' value='HandMade' label='HandMade' />);
        categoryArray.push(<Picker.Item key='7' value='Health' label='Health' />);

        return categoryArray;

    }

    render(): React$Element<*> {
        const {top10, loading,currentuserid,selectTop_id} = this.state;
        if (loading) {

            return <BaseContainer title="VOX POPULI" navigation={this.props.navigation} scrollable>
            <Image source={Images.login} style={styles.img} >
            <ScrollView style={styles.imgMask }>
            {
                    <View style={ Styles.flex }>
                      <ActivityIndicator
                        animating={ loading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>
                }
                </ScrollView>

                    <Button primary full>
                      {this.state.loading ? <Spinner color="white" /> : <Text style={{color:'#fff'}}>Въведи</Text>}
                    </Button>

                </Image>
                <Toast ref="toast"/> 
                </BaseContainer>;
            

        }else{

            return <Image source={Images.drawer} style={styles.img} ><BaseContainer title="VOX POPULI" navigation={this.props.navigation} >
            
            <Picker
                                  iosHeader="Select one"
                                  mode="dropdown"
                                  selectedValue={this.state.category}
                                  onValueChange={(itemValue, itemIndex) => this.selectStateCategory(itemValue, itemIndex)}
                                >
                                  {this.renderCategory()}
                                </Picker>
            <ScrollView style={styles.imgMask }>
            {
                !loading && <View>

                    {
                        top10.length==0 && <View>
                           <Text style={{flex:1, flexDirection:'row',fontSize:20,padding:20,
         textAlign:'center'}}>Няма намерени резултати</Text>
                        </View>
                    }
                    {
                       
                        _.map(
                            top10,
                            (item, key) => <Item
                                key={key}
                                submitvote={(userid)=>this.submitvote(userid)}
                                selectkey={key}
                                selectTop_id={selectTop_id}
                                navigation={this.props.navigation}
                                firstname={item.firstname}
                                secondname={item.secondname}
                                secondvotes={item.secondvotes}
                                firstvotes={item.firstvotes}
                                firstphoto={item.firstphoto}
                                secondphoto={item.secondphoto}
                                
                                rank={item.user_rank}
                                image={item.top_image}
                                token={item.vp_tokens}
                                currentuserid={currentuserid}
                                userid={item.top_id}
                            />
                        )
                    }
        
                </View>


            }

             </ScrollView>

                    <Button primary full onPress={this.inserttop10}>
                      <Text style={styles.insert}><Icon name="md-add"/> Въведи</Text>
                    </Button>

              <Toast ref="toast"/> 
            
            <Modal
              visible={this.state.loadingVisible}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => this.closeModal()}>

            <TouchableOpacity style={{flex:1,flexDirection:'column',justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)',}}>
                    <Spinner color="#fff" />
                </TouchableOpacity>
          </Modal>

            


            </BaseContainer></Image>;
        }
        
        
    }
}


@observer
class Item extends Component {

    props: {
        name: string,
        rank:sting,
        userid:number,
        navigation:any,
        selectTop_id:any
        
    }


    @autobind @action
    toggle() {
        // const {userid,navigation,name,currentuserid,selectkey} = this.props;
       //  navigation.navigate("Topdetails",{name:name,userid:userid,currentuserid:currentuserid,key:selectkey,type:'top'});
    }

    @autobind @action
    vote(){

        const {userid} = this.props;
       this.props.submitvote(userid);
    }

    render(): React$Element<*>  {
        const {firstname,secondname,firstphoto,secondphoto,firstvotes,secondvotes,rank,userid,currentuserid,image,token,item,selectTop_id} = this.props;
        const btnStyle ={ backgroundColor: this.done ? variables.brandInfo : variables.lightGray };
        return <View style={Styles.listItem} >

           

                <TouchableOpacity style={[Styles.center, styles.title, styles.topnames]}>
                    <View style={{flexDirection:'row'}}>
                        <View>
                            {firstphoto!=''&&<Image style={{width:40,height:40}} source={{uri:firstphoto}}/>}
                        {firstphoto==''&&<Avatar size={40}/>}

                           
                        </View>
                        <View>
                            <Text style={styles.firstname}>{firstname}</Text>
                            <Text style={styles.votes}>{firstvotes} Гласувай</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.vs}>VS</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View>
                           
                        {secondphoto!=''&&<Image style={{marginRight:2,width:40,height:40}} source={{secondphoto}}/>}
                        {secondphoto==''&&<Avatar  style={{marginRight:2}} size={40}/>}
                        </View>
                        <View>
                        <Text style={styles.secondname}>{secondname}</Text>
                        <Text style={styles.votes}>{secondvotes} Гласувай</Text>
                        </View>
                    </View>
                </TouchableOpacity>


            

        </View>;

    }
}


const styles = StyleSheet.create({

    img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
    imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)"
    },
    button: {
        height: 75, width: 75, borderRadius: 0
    },
    title: {
        paddingLeft: variables.contentPadding,
        padding:20
    },
    userrank:{
        flex:2, 
        left: 0, 
        right: 0, 
        bottom: 0
    },
    namebold:{
        fontWeight:'bold',
                color:'#00CE9F'
    },
    namebold:{
        fontWeight:'bold',
                color:'#00CE9F'
    },
    topnames:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    name:{
        fontSize:16
    },
    activename:{
        backgroundColor:'#635DB7'
    },
    activecolor:{
        
    },
    userrank:{
        flex:2, 
        left: 0, 
        right: 0, 
        bottom: 0
    },
    topnames:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    firstname:{
        color:'#635DB7'
    },   
    secondname:{
        color:'#00CE9F'
    },
    votes:{
        fontWeight:'bold'
    },
    vs:{
        fontWeight:'bold',
        fontSize:20,
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: variables.contentPadding
    },
        gray: {
        color: variables.gray
    },
    toplist:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    top_name:{
        lineHeight:20,
        color:'#635DB7'
    },

    lefttop:{
        width:130
    },
    middletop:{
        width:40
    },
    top_vp:{
        color:'#635DB7',
        fontWeight:'bold',
        paddingRight:5
    },
    insert:{
      color:'#fff',
      fontSize:25
    },
    vpbtns:{
        padding:1
    },
    vpbtn:{
        color:'#fff',
        fontSize:18
    }




});