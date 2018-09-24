// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet, KeyboardAvoidingView, ScrollView , Modal, Text,CameraRoll,TouchableOpacity,ActivityIndicator} from "react-native";
import {H1, Grid,Col, ActionSheet, Content, Root} from "native-base";
import {Container, Button, Header, Left, Right, Body, Icon, Title,Spinner, Picker, Item} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import {BaseContainer, Avatar, TaskOverview,Images, Small, Styles, Task, Field,WindowDimensions, NavigationHelpers} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import api from '../Utils/api';
import helper from '../Utils/helper';

import Toast,{DURATION} from "react-native-easy-toast";
import ImagePicker from "react-native-image-picker";
import {
  fetchRankListService,
} from "../actions/UserRankAction";
import { connect } from "react-redux";


var BUTTONS = ["Gallery", "Camera", "Cancel"];   
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
export  class Profile extends Component {  

    constructor(props) {    
        super(props)

        this.image_path = 'https://voxpopuliapp.com/services/';
        this.imagechange= false;

        console.log(this.props.navigation.state.params.photo);

        this.state = {
            isLoading: false,
            containerloading:false,
            user_name:this.props.navigation.state.params.username,
            user_email:'',
            user_password:'',
            user_phonenumber:'',
            user_age:'',
            user_country:'',
            city_town:'',
            user_repeatpassword:'',
            photo:this.props.navigation.state.params.photo,
            photoList:[],
            disabled:true,
            modalVisible: false,
            galleryVisible:false,
            imageloading:true,
            Iscurrentuser:false,
            galleryImage:'',
            vp_tokens:this.props.navigation.state.params.vp_tokens+" vp",
            current_id:this.props.navigation.state.params.current_id
        }


        console.log('new-----',this.props.navigation.state.params);
        this.updatePhotoList=[];
        this.photoArray =[];
  }
   

  openModal() {
    this.setState({modalVisible:true});
      
    this.getPhoto();
  }
  @autobind
  closeModal() {
    this.setState({modalVisible:false});
  }

  @autobind
  closeGalleryModal() {
    this.setState({galleryVisible:false});
  }

  componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            console.log(res);
            if(res){

                this.userData = JSON.parse(res);

                console.log('this.userData.user_id====',this.userData.user_id,this.state.current_id);
                if(this.userData.user_id==this.state.current_id){


                    let profileImage = '';     

                    if(this.userData.photo!=''){

                        profileImage = 'http://voxpopuliapp.com/services/'+this.userData.photo;
                    }

                   // alert(profileImage);
                    console.log(profileImage);       
                  //  alert(profileImage);   

                    var image1 ='';
                    var image2 = '';   
                    var image3 = '';
                    var image4 ='';

                    if(this.userData.photo[1]){

                         image1 = this.image_path+this.userData.photo[1];
                    }
                    if(this.userData.photo[2]){

                         image2 = this.image_path+this.userData.photo[2];
                    }
                    if(this.userData.photo[3]){

                         image3 = this.image_path+this.userData.photo[3];
                    }
                    if(this.userData.photo[4]){

                         image4 = this.image_path+this.userData.photo[4];
                    }      

                    this.setState({    
                        Iscurrentuser:true,
                        isLoading: false,
                        containerloading:false,
                        photo:profileImage,
                        vp_tokens:String(this.userData.tokens)+" vp",
                        user_id:this.userData.user_id,
                        user_name:this.userData.user_name,
                        user_email:this.userData.user_email,
                        user_password:this.userData.user_password,
                        user_phonenumber:this.userData.user_phonenumber,
                        user_age:this.userData.user_age,
                        user_country:this.userData.user_country,
                        city_town:this.userData.city_town,
                        image1:image1,
                        image2:image2,
                        image3:image3,
                        image4:image4  

                    })

                    console.log('this.userData.user_id===',this.userData.user_id);
                }else{

                    console.log('no userid=====');
                }
                
                
            }else{

                this.setState({isLoading:false}); 
            }
            
           
        })

        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
    }   

     getPhoto(){   

            let data ={
                user_id:this.state.current_id
            }
            console.log(data);
            //alert(JSON.stringify(data));
            api.postApi('user_photo_list_service.php',data)
                  .then((res) => {

                    console.log(res);  

                   
                    if(res.Result=='True'){
                        
                        //console.log('photolist===',res.data);
                        
                        this.photoArray =[];

                        for(var i=0;i<res.data.length;i++){

                            for(var j=0;j<res.data[i].length;j++){

                                let data={
                                    uri:res.data[i][j],
                                    loaded:true
                                }

                                 this.photoArray.push(data);
                            }
                        }
                        
                        console.log("xcx==",this.photoArray);

                        this.setState({photoList:this.photoArray,currentuserid:user_id,imageloading:false});
                       

                    }else{

                        this.setState({imageloading:false}); 
                    }
                   
            })
            .catch((e) => {

                     //alert(e.message);
                //this.refs.toast.show(e.message);
                this.setState({imageloading:false});

            })
    }

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    showActionSheetForProfile(){
        
        if(this.state.Iscurrentuser){

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

                    
                    console.log(response.uri);
                    this.imagechange =true;   
                    this.setState({photo:response.uri,disabled:false});
                }
            })


        }
       
        
    }

    showActionSheet(){

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

                console.log(response.uri);
                this.imagechange =true;
                this.updatePhotoList.push(response);
                //this.state.photo.push(image);
               // alert('updateimage===');
                this.setState({photoList:this.updatePhotoList,disabled:false});
            }
        })
   
        // ActionSheet.show(
         //      {
         //        options: BUTTONS,
         //        cancelButtonIndex: CANCEL_INDEX,
         //        destructiveButtonIndex: DESTRUCTIVE_INDEX,
         //        title: "Upload"
         //      },
         //      buttonIndex => {
         //        console.log('buttonIndex',buttonIndex);
         //        if(buttonIndex==0){

         //            this.getImageFromGallery();
         //        }
         //        if(buttonIndex==1){

         //            this.getImage();
         //        }
                
         //        this.setState({ clicked: BUTTONS[buttonIndex] });
         //      }
         //    )
    }

    

    @autobind
    updateProfile() {
        try {
             
             console.log('update profile api========');   
             var user_email = this.state.user_email;
             var user_name = this.state.user_name;
             var user_password = this.state.user_password;
             var user_phonenumber = this.state.user_phonenumber;
             var user_age = this.state.user_age;
             var user_country = this.state.user_country;
             var city_town = this.state.city_town;
             var user_repeatpassword = this.state.user_repeatpassword;

             var emailRegex = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

             if(user_name==''){

                this.refs.toast.show('Please provide username');

             }else if(user_email==''){

                this.refs.toast.show('Please provide email address');

             }else if(!emailRegex.test(user_email)){

                this.refs.toast.show('Email format is invalid');

             }else{

                this.setState({isLoading:true});
                
                let data;


                //alert('image change===');
                if(this.imagechange){

                    let imagedata ={
                        uri:this.state.photo,
                        name:'profile.jpg',
                        type:'image/jpg'
                    }

                    data ={
                        'user_id':this.userData.user_id,
                        'user_name':user_name,
                        'user_email':user_email,
                        'user_phonenumber':user_phonenumber,
                        'user_age':user_age,
                        'user_country':user_country,
                        'city_town':city_town,
                        'image_files[]':imagedata
                    }  

                     //alert(JSON.stringify(data));
                }else{   

                    data ={   
                        user_id:this.userData.user_id,
                        user_name:user_name,
                        user_email:user_email,
                        user_phonenumber:user_phonenumber,
                        user_age:user_age,
                        user_country:user_country,
                        city_town:city_town
                    }      
                }   
                

                console.log('innnn',data);  
                api.postApi('user_update_service.php',data)
                  .then((res) => {

                    console.log(res);
                    this.setState({isLoading:false,disabled:true});
                    if(res.Result=='True'){

                        console.log('this.userData.photo===',this.userData.photo);
                        if(this.imagechange){

                            this.userData.photo = 'images/user_image/'+res.user_image[0];
                            this.imagechange= false;
                        }
                        

                        this.userData.user_name = user_name;
                        this.userData.user_email = user_email;
                        this.userData.user_phonenumber = user_phonenumber;
                        this.userData.user_age = user_age;
                        this.userData.user_country = user_country;
                        this.userData.city_town = city_town;

                        helper.setCache('@userdata',this.userData);
                        this.refs.toast.show(res.ResponseMsg);
                        this.props.fetchRankListService('rank_list_service.php',{user_id:this.userData.user_id});   

                    }else{

                        this.refs.toast.show(res.ResponseMsg);
                    }
                    
                  })
                  .catch((e) => {
                    // alert(e.message);
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

    @autobind
    updateMultiplePhoto(){

        this.setState({isLoading:true});
        var imageArray=[];

        for(let data in this.state.photoList){
              
              let imagedata ={
                  uri:this.state.photoList[data].uri,
                  name:'profile'+data+'.jpg',
                  type:'image/jpg'
              }

              //imageArray = imagedata;

            imageArray.push(imagedata);
        }  

        api.postUploadApi('user_update_service.php',imageArray,this.userData.user_id)
                  .then((res) => {

                    console.log(res);
                   // alert(JSON.stringify(res));      

                    this.setState({isLoading:false,disabled:true});
                    if(res.Result=='True'){

                        
                        this.refs.toast1.show(res.ResponseMsg);

                    }else{

                        this.refs.toast1.show(res.ResponseMsg);
                    }

                    
                    
                  })
                  .catch((e) => {
                    // alert(e.message);
                    console.log(e.message);
                     this.refs.toast1.show(e.message);
                     this.setState({isLoading:false});
                  })


        

    }

    showGalleryImage(data,index,oldImage){

        console.log('data==',index);  
        this.selectGalleryIndex= index;
        this.oldImage = oldImage;
        this.setState({galleryImage:data.uri,galleryVisible:true});
    }

    renderProfileList(){

        var profilelist=[];

        for(let data in this.photoArray){

           profilelist.push(<View key={data} ><TouchableOpacity onPress={() => this.showGalleryImage(this.photoArray[data],data,true)}><Col style={{ height: 110, padding:5 }}><Image style={{width:80,height:80}} source={{uri:this.photoArray[data].uri}}/></Col></TouchableOpacity></View>);
        }

        for(let data in this.state.photoList){

           profilelist.push(<View key={data}><TouchableOpacity onPress={() => this.showGalleryImage(this.state.photoList[data],data,false)}><Col style={{ height: 110, padding:5 }}><Image style={{width:80,height:80}} source={{uri:this.state.photoList[data].uri}}/></Col></TouchableOpacity></View>);
        }
        
        //alert(profilelist);  

        return profilelist;         
                 
    }

    @autobind
    async getImageFromGallery(): Promise<void> {
        console.log('camera start');
        // CameraRoll.getPhotos({
        //     first:20
        // }).then(r=>{
        //     console.log(r.edges);
        // }).catch((err)=>{

        //     console.log('err images===',err);
        // })


        // let result = await ImagePicker.launchImageLibraryAsync({
        //     allowEditing:true,
        //     aspect:[4,3]
        // })

        // //console.log(result);

        // if(!result.cancelled){

        //     console.log(result.uri);
        //     console.log(result);
        //     this.imagechange =true;
            

        //     this.updatePhotoList.push(result);
        //     //this.state.photo.push(image);
        //     this.setState({photoList:this.updatePhotoList,disabled:false});
        // }
    }


    


     @autobind
    async getProfileImageFromCamera(): Promise<void> {
        console.log('camera start');
        // CameraRoll.getPhotos({
        //     first:20
        // }).then(r=>{
        //     console.log(r.edges);
        // }).catch((err)=>{

        //     console.log('err images===',err);
        // })

        let result = await ImagePicker.launchCameraAsync({
            allowEditing:true,
            aspect:[4,3]
        })

        //console.log(result);

        if(!result.cancelled){

            console.log(result.uri);
            console.log(result);
            this.imagechange =true;
            

            //this.updatePhotoList.push(result);
            //this.state.photo.push(image);
            this.setState({photo:result.uri,disabled:false});
        }
    }


     @autobind
    async getProfileImageFromGallery(): Promise<void> {
        console.log('camera start');
        CameraRoll.getPhotos({
            first:10,
            assetType:'All'
        }).then(r=>{
            console.log(r.edges);
        }).catch((err)=>{

            console.log('err images===',err);
        })
   
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     allowEditing:true,
        //     aspect:[4,3]
        // })

        // //console.log(result);

        // if(!result.cancelled){

        //     console.log(result.uri);
        //     console.log(result);
        //     this.imagechange =true;
            

        //     //this.updatePhotoList.push(result);
        //     //this.state.photo.push(image);
        //     this.setState({photo:result.uri,disabled:false});
        // }
    }

    @autobind
    async getImage(): Promise<void> {
        console.log('camera start');
        // CameraRoll.getPhotos({
        //     first:20
        // }).then(r=>{
        //     console.log(r.edges);
        // }).catch((err)=>{

        //     console.log('err images===',err);
        // })

        let result = await ImagePicker.launchCameraAsync({
            allowEditing:true,
            aspect:[4,3]
        })

        //console.log(result);

        if(!result.cancelled){

            console.log(result.uri);
            console.log(result);
            this.imagechange =true;
            

            this.updatePhotoList.push(result);
            //this.state.photo.push(image);
            this.setState({photoList:this.updatePhotoList,disabled:false});
        }
    }

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    
    setAvatarImage(){   

      var imageList = this.state.galleryImage.split('/');
      console.log('set avatr image====',imageList[imageList.length-1]);
     // this.state.photo =
      this.userData.photo = 'images/user_image/'+imageList[imageList.length-1];
      console.log(this.userData);
      helper.setCache('@userdata',this.userData);
      this.closeGalleryModal();
      this.setState({photo:this.state.galleryImage,modalVisible:false,disabled:false});
      //this.refs.toast1.show('profile image updated');
      this.actionImage('set',imageList[imageList.length-1]);
      
    }

    actionImage(type,imagename){

                this.setState({isLoading:true});
                let data ={
                    user_id:this.userData.user_id,
                    action:type,
                    avatar:imagename
                }    

                console.log(data);

                api.postApi('update_user_avatar_service.php',data)
                  .then((res) => {

                    console.log('res====',res);  
                   // alert(JSON.stringify(res));      

                    this.setState({isLoading:false,disabled:true});
                    if(res.Result=='True'){

                        
                     //   this.refs.toast1.show(res.ResponseMsg);

                    }else{

                       // this.refs.toast1.show(res.ResponseMsg);
                    }

                    
                    
                  })  
                  .catch((e) => {
                    // alert(e.message);
                    console.log(e.message);
                     //this.refs.toast1.show(e.message);
                     this.setState({isLoading:false});
                  })
    }

    removeImage(){
   
      console.log('remove avatr image====',this.selectGalleryIndex);
      console.log('profilelist',this.photoArray);


      if(this.oldImage){

        var imageList = this.photoArray[this.selectGalleryIndex].uri.split('/');
        console.log('imageList===',imageList);
        this.actionImage('delete',imageList[imageList.length-1]);
        this.photoArray.splice(this.selectGalleryIndex,1);  

      }else{

      }

      this.refs.toast1.show('sucessfully image deleted');
      
      this.closeGalleryModal();     
    }

    changeState = (type) => {

           
        this.setState(type);
        this.setState({disabled:false})
    }

    render(): React$Element<*> {

        if (this.state.containerloading) {

            return <Image source={Images.login} style={style.img} ><Container>
            <Toast ref="toast"/> 
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Profile</Title>
                </Body>
                <Right />
            </Header>
            {
                    <View style={ Styles.flex }>
                      <ActivityIndicator
                        animating={ this.state.containerloading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>
                }
                </Container></Image>;
            

        }else{

            return <Image source={Images.login} style={style.img} ><Container>
            <Toast ref="toast"/> 
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Profile</Title>
                </Body>
                <Right />
            </Header>
            <ScrollView style={style.imgMask} >
                                <View style={[Styles.header, Styles.center]}>
                        <H1  style={{ marginTop: variables.contentPadding * 2 }}>{this.state.user_name}</H1>
                        
                        <TouchableOpacity onPress={() => this.showActionSheetForProfile()}>
                         {this.state.photo!=''&&<Image style={{width:100,height:100}} source={{uri:this.state.photo}}/>}
                        {this.state.photo==''&&<Avatar size={100}/>}

                        </TouchableOpacity>

                        <TouchableOpacity >
                        <Button light style={{margin:10}} onPress={() => this.openModal()}>
                            <Text>повече </Text>
                        </Button>
                        </TouchableOpacity>

                     </View>  

                     <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between' , padding: 20 }}>
                        <View>
                           {this.state.image1!=''&&<Image style={{width:50,height:50}} source={{uri:this.state.image1}}/>}
                            
                        </View>  
                        <View>
                            {this.state.image2!=''&&<Image style={{width:50,height:50}} source={{uri:this.state.image2}}/>}
                             
                        </View>
                        <View>
                             {this.state.image3!=''&&<Image style={{width:50,height:50}} source={{uri:this.state.image3}}/>}
                            
                        </View>
                        <View>
                            {this.state.image4!=''&&<Image style={{width:50,height:50}} source={{uri:this.state.image4}}/>}
                             
                        </View>
                     </View>
                <KeyboardAvoidingView behavior="padding">   


                    <Field placeholder="Username" autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                editable={this.state.Iscurrentuser}
                                value={this.state.user_name}
                                onChangeText={(user_name) => this.changeState({user_name})}
                                 />

                    {!this.Iscurrentuser&&<Field placeholder="Token" autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                editable={false}
                                value={this.state.vp_tokens}
                                
                                 />}        

                    
                    {this.Iscurrentuser&&<Field placeholder="Email"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                value={this.state.user_email}
                                editable={false}
                                selectTextOnFocus={false}
                                
                                 />}
                    {this.state.Iscurrentuser&&<Field placeholder="Phone Number" 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                value={this.state.user_phonenumber}
                                onChangeText={(user_phonenumber) => this.changeState({user_phonenumber})}
                                />}
                    {this.state.Iscurrentuser&&<Field placeholder="Age" 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                value={this.state.user_age}
                                onChangeText={(user_age) => this.changeState({user_age})}
                                />}
                    {this.state.Iscurrentuser&&<Field placeholder="Country" 
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                value={this.state.user_country}
                                onChangeText={(user_country) => this.changeState({user_country})}
                                />}
                    {this.state.Iscurrentuser&&<Field placeholder="City/Town" 
                                autoCapitalize="none"
                                autoCorrect={false}tger
                                keyboardType="default"
                                returnKeyType="next"
                                value={this.state.city_town}
                                onChangeText={(city_town) =>this.changeState({city_town})}
                                />}
                </KeyboardAvoidingView>
            </ScrollView>

            {this.state.Iscurrentuser&&<Button  primary full onPress={this.updateProfile} style={{ height: variables.footerHeight }} >
               {this.state.isLoading ? <Spinner color="white"/> : <Text style={{ color:'#fff' }}>запази</Text>} 
            </Button>}
  <Root>
            <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
                <Header>
                <Left>
                    <Button onPress={this.closeModal} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Gallery</Title>
                </Body>
                <Right />
                </Header>
                {this.state.imageloading&&<ActivityIndicator animating={ this.state.imageloading } style={[Styles.centering,{ height: 80 }]} size="large" />}
                {!this.state.imageloading&&<ScrollView>

              {<View style={style.innerContainer}>
                    {this.renderProfileList()}       
              </View>}
          </ScrollView>}
          
          {!this.state.imageloading&&this.Iscurrentuser&&<View style={style.buttons}>
          <Button
            onPress={() =>this.showActionSheet()}
          >
            <Text style={{ margin:10, width:100, textAlign:'center', color:'#fff' }}>ADD</Text>
          </Button>

            <Button onPress={this.updateMultiplePhoto}>
              {this.state.isLoading ? <Spinner color="white"/> : <Text style={{ margin:10,  width:100, textAlign:'center', color:'#fff' }}>UPLOAD</Text>} 
            </Button>
          </View>}
           <Toast ref="toast1"/>    
          </Modal>


            <Modal
              visible={this.state.galleryVisible}
              onRequestClose={() => this.closeGalleryModal()}
          >
             <Header>
                <Left>
                    <Button onPress={this.closeGalleryModal} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>View Image</Title>
                </Body>
                <Right />
                </Header>   
   
                <ScrollView >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <View >
                        <Image source={{uri:this.state.galleryImage}} style={{width:320, height: 320, marginTop: 30 }} />
                    </View>
                    {this.state.Iscurrentuser&&<View>
                        <Button light style={{margin:10}} onPress={() => this.setAvatarImage()}>
                            <Text> Set as Avatar Image </Text>
                        </Button>
                        <Button light style={{margin:10}} onPress={() => this.removeImage()}>
                            <Text> Remove Image </Text>
                        </Button>
                    </View>}
                </View>
                </ScrollView>

           <Toast ref="toast1"/>    
          </Modal>

            </Root>
        </Container></Image>;
        }
        
    }
}

const mapStateToProps = state => {
  
  console.log(state.UserRankReducer);
  return {
    rankList: state.UserRankReducer.rankList,
    isServiceFetching:state.UserRankReducer.isServiceFetching
  };
}

export default connect(mapStateToProps, {
  fetchRankListService,
})(Profile);

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


  innerContainer: {

    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  buttons:{
    justifyContent: 'space-between',
    flexDirection:'row',
    margin:20
  }
});