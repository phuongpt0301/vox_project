// @flow
import React, {Component} from "react";
import {StyleSheet, View, Image, Dimensions, Text,ActivityIndicator, ScrollView} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Images, Small, Styles, Task, WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import api from '../Utils/api';
import helper from '../Utils/helper';

export default class Activity extends Component {
    
    constructor(props) {
    super(props)

    this.state = {
          loading: false,
          Favourite: "",
          rating: "",
          totaltime: "",
          username: "",
          currentuserid:''
        }

       
    }

    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            
            if(res){

                this.userData = JSON.parse(res);
                this.setState({"rating":this.userData.rating,"totaltime":this.userData.totaltime})
                //this.getData(this.userData.user_id);
                
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
            api.postApi('activity_list_service.php',data)
                  .then((res) => {

                    
                    if(res.Result=='True'){
                        console.log(res.data);
                        this.setState({loading:false,Favourite:res.data.Favourite,rating:res.data.rating,totaltime:res.data.totaltime,username:res.data.username}); 
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



    render(): React$Element<*> {

        if (this.state.loading) {

            return <BaseContainer title="Активност" navigation={this.props.navigation} scrollable>
                            <Image source={Images.drawer} style={style.img} >
            <ScrollView style={style.imgMask }>
            {
                    <View style={ Styles.flex }>
                      <ActivityIndicator
                        animating={ this.state.loading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>
                }
                 </ScrollView>
                </Image>
            </BaseContainer>;
            

        }else{

            return <BaseContainer title="Активност" navigation={this.props.navigation} scrollable>
                <Image source={Images.drawer} style={style.img} >
            <ScrollView style={style.imgMask }>
                <View style={style.user}>
                    <Text style={style.username}>{this.state.username}</Text>
                </View>


                 <Task title={this.state.totaltime} subtitle="Продължителност " />
                 <Task title='Book' subtitle="Любима игра " />
                 <Task title={this.state.rating} subtitle="рейтинг " />
                                            
                 </ScrollView>
                </Image>
            </BaseContainer>;
        }
        
    }
}


const {width} = Dimensions.get("window");
const style = StyleSheet.create({
username:{
    fontSize:25,
    fontWeight:'bold',
    paddingBottom:10,
    color:'#00CE9F'
},
user:{
    justifyContent: 'center',
    alignItems: 'center',
},
timespend:{
    flex:1,
    flexDirection:'row',
    padding:10
},
timespendinner:{
    fontSize:18,
    color:'#00CE9F'
},
timespendhead:{
    fontSize:18,
    color:'#635DB7'
},
            img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
     imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)"
    }
});