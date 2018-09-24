// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, TouchableOpacity,ScrollView,Picker, Footer,ActivityIndicator,ListView} from "react-native";
import {H1,H3, Button, Icon, ListItem} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import {BaseContainer, Styles, Images, Avatar,WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Small from "../components/Small";
import api from '../Utils/api';
import helper from '../Utils/helper';
import ModalFilterPicker from 'react-native-modal-filter-picker'


import {
  fetchRankListService,
} from "../actions/UserRankAction";
import { connect } from "react-redux";


var allcountries = require('countries-cities');

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
})


export  class Lists extends Component {
    

    constructor(props) {

        super(props)

        this.state = {
          loading: true,
          rankList:ds.cloneWithRows([]),
          currentuserid:'',
          countryList:allcountries.getCountries(),
          cityList:[],
          selectCountry:'-1',
          selectCity:'-1',
          selected2: undefined,
          count:0
        }

        this.renderRow = this.renderRow.bind(this)
       
    }




    onValueChange2(value: string) {
        this.setState({
          selected2: value
        });
    }    

     componentWillReceiveProps(nextProps) {
      // If isAFavourite is toggled, update it
      if (nextProps.rankList !== this.props.rankList) {

                var res = nextProps.rankList;

                  if(res.Result=='True'){

                       // alert(JSON.stringify(res.data));
                        
                        console.log('render rank list=====',res);   
                        this.renderRankList(res);
                        

                    }else{

                        this.setState({loading:false});            
                    }   


      }    

    }

    renderRankList(res){

                        for(let data in res.data){

                            res.data[data].avg_rating = parseFloat(Math.round((res.data[data].avg_rating)*100)/100).toFixed(2);
                        }
                        

                       let sortdata = res.data;  (function(a, b){return b.avg_rating - a.avg_rating});
                       sortdata.sort((function(a, b){return b.avg_rating - a.avg_rating}));
                       var checkarray = [];
                       var newList =[];

                       for(let data in sortdata){

                            
                            if(checkarray.indexOf(sortdata[data].user_id)==-1){

                                checkarray.push(sortdata[data].user_id);
                                newList.push(sortdata[data]);
                            }
                       }


                       this.setState({rankList:ds.cloneWithRows(newList)}); 
    }
    
    getData(user_id){   

            let data ={  
                user_id:32
            }  

            this.setState({loading: true})
            
            if(this.state.selectCity!='-1'){

                data.city_town = this.state.selectCity;
            }   

            console.log('data---',data);
            this.setState({currentuserid:this.userData.user_id})             
            this.props.fetchRankListService('rank_list_service.php',data);   
    }

   compare(a,b) {
          if (a.rating < b.rating)
            return -1;
          if (a.rating > b.rating)
            return 1;
          return 0;
    }

    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

           
            if(res){

                this.userData = JSON.parse(res);

                this.getData(this.userData.user_id);
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })
    }

    getCountries(){

            let data ={
                user_id:''
            }

            api.postApi('country_list_service.php',data)
                  .then((res) => {

                    if(res.Result=='True'){

                        this.setState({loading:false,countryList:res.data}); 

                    }else{

                         this.setState({loading:false}); 
                    }
                   
            })
            .catch((e) => {

                this.setState({containerLoading:false});

            })
    }

    renderCountryList(){

        var pickerArray =[];

        pickerArray.push(<Picker.Item key='-1' value='-1' label='изберете държава' />);

        if(this.state.countryList.length>0){

            for(let data in this.state.countryList){  


                pickerArray.push(<Picker.Item key={data} value={this.state.countryList[data]} label={this.state.countryList[data]} />);
            }

        }

        return pickerArray;


    }

    renderCityList(){

        var pickerCityArray =[];
        pickerCityArray.push(<Picker.Item key='-1' value='-1' label='изберете град' />);

        if(this.state.cityList.length>0){

            this.state.cityList =this.state.cityList.sort();
            for(let data in this.state.cityList){  


                pickerCityArray.push(<Picker.Item key={data} value={this.state.cityList[data]} label={this.state.cityList[data]} />);
            }

        }

        return pickerCityArray;


    }

    getCites(country_id){

            let data ={
                country_id:country_id
            }

            this.setState({loading:true});

            api.postApi('city_list_service.php',data)
                  .then((res) => {

                   
                    if(res.Result=='True'){
                        
                        
                        this.setState({loading:false,cityList:res.data}); 
                       

                    }else{

                         this.setState({loading:false}); 
                    }
                   
            })
            .catch((e) => {

                this.setState({loading:false});

            })

    }

    selectStateObject(itemValue, itemIndex){

        
        console.log('itemValue',itemValue,'itemIndex',itemIndex);
        if(itemValue==-1){

            this.setState({selectCountry:itemValue,selectCity:'-1',rankList:ds.cloneWithRows([])})
            this.props.fetchRankListService('rank_list_service.php',{user_id:32});

        }else{

            this.setState({selectCountry:itemValue,cityList:allcountries.getCities(itemValue),rankList:ds.cloneWithRows([])})
            let data = {user_id:32,country:itemValue};
            this.props.fetchRankListService('rank_list_service.php',data);
            
        }
        
    }

    selectCityObject(itemValue, itemIndex){

        this.state.selectCity=itemValue;
        this.setState({selectCity:itemValue})
        console.log(this.state.selectCity);
        if(itemValue!='-1'){
   

         this.setState({rankList:ds.cloneWithRows([])})
         this.getData(this.userData.user_id);
        }

    }


    go(key: string) {
        this.props.navigation.navigate(key);
    }

    toggle(rowData,rowID) {
         
         this.props.navigation.navigate("Topdetails",{name:rowData.username,userid:rowData.user_id,currentuserid:this.state.currentuserid,key:rowID,type:'ranklist'});
    }


    renderRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.listItem} >
            

            {this.state.currentuserid!=rowData.user_id&&<TouchableOpacity style={[Styles.center, styles.title, styles.topnames]}  onPress={() => this.toggle(rowData,rowID)}>
                

            <View style={styles.toplist}>  

                <View style={styles.lefttop}>
                    <H3 style={styles.top_name}>{rowData.username}</H3>
                    <Text style={styles.gray}>Rank - {Number(rowID)+1}</Text>
                </View>
                <View style={styles.middletop}>
                     {rowData.photo!=''&&<Image style={{width:50,height:50}} source={{uri:rowData.photo}}/>}
                {rowData.photo==''&&<Avatar size={50}/>}
                </View>
                <View>
                    <H3 style={styles.top_vp}>{rowData.avg_rating}</H3>
                </View>
            </View>
            </TouchableOpacity>}
       
             {this.state.currentuserid==rowData.user_id&&<TouchableOpacity style={[Styles.center, styles.title, styles.topnames, styles.activename]} onPress={() => this.toggle(rowData,rowID)}>
                
               <View style={[styles.toplist, styles.activecolor]} >   
                    <View style={styles.lefttop}>
                        <H3 style={styles.top_name}>{rowData.username}</H3>
                        <Text style={styles.gray}>Rank - {Number(rowID)+1}</Text>
                    </View>
                    <View style={styles.middletop}>
                         {rowData.photo!=''&&<Image style={{width:50,height:50}} source={{uri:rowData.photo}}/>}
                        {rowData.photo==''&&<Avatar size={50}/>}
                    </View>
                    <View >
                        <H3 style={styles.top_vp}>{rowData.avg_rating} </H3>    
                    </View>
                </View>
            </TouchableOpacity>}

        </View>
    )
  }


    render(): React$Element<*> {
        const {rankList, loading,currentuserid} = this.state;
        console.log('this.props.isFetching==',this.props)  
        if (this.props.isServiceFetching||this.props.isServiceFetching==undefined) {

            return <BaseContainer title="Класация" navigation={this.props.navigation} >
                <Image source={Images.drawer} style={styles.img} >
                    <ScrollView style={styles.imgMask }>
                    {
                            <View style={ styles.flex }>
                              <ActivityIndicator
                                animating={ loading }
                                style={[
                                  styles.centering,
                                  { height: 80 }
                                ]} size="large" />

                            </View>

                        }
                    </ScrollView>
                </Image>
            </BaseContainer>;
            

        }else{         

            return <BaseContainer title="Класация" navigation={this.props.navigation} >

                        <Image source={Images.drawer} style={styles.img} >
                        <View style={styles.imgMask }>
                            <View style={styles.rankcity}>
                                <View style={styles.rankcity1}>   
                                    <Picker mode="dialog"  selectedValue={this.state.selectCountry} 
                                      onValueChange={(itemValue, itemIndex) => this.selectStateObject(itemValue, itemIndex)}>
                                      {this.renderCountryList()}
                                    </Picker>
                                </View>
                                <View style={styles.rankcity2}>
                                    <Picker mode="dialog" selectedValue={this.state.selectCity} 
                                        onValueChange={(itemValue, itemIndex) => this.selectCityObject(itemValue, itemIndex)}>
                                      {this.renderCityList()}
                                    </Picker>
                                </View>
                            </View>
           
            {
                !this.props.isServiceFetching && <View>

                    {
                        rankList.length==0 && <View>
                             <Text style={{flex:1, flexDirection:'row',fontSize:20,padding:20,
         textAlign:'center'}}>Няма намерени резултати</Text>
                        </View>
                    }
                    {
                         <ListView
                         enableEmptySections={true}
                        dataSource={ rankList }
                        renderRow={ this.renderRow } />
                    }

                </View>
            }
           </View>
        </Image>
            </BaseContainer>;
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
})(Lists);

const styles = StyleSheet.create({
    mask: {
        backgroundColor: "rgba(0, 0, 0, .5)"
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
    topnames:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    name:{
        fontSize:16
    },
    activename:{
        backgroundColor:'#999',

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
        lineHeight:25,
        color:'#635DB7'
    },
    rankcity:{
        flex:0,
        flexDirection:'row'
    },
    rankcity1:{
        flex:2,
    },
    rankcity2:{
        flex:2,

    },    
    lefttop:{
        width:130
    },
    middletop:{
        width:40
    },
    top_vp:{
        color:'#00CE9F',
        width:150,
        textAlign:'right',
        marginRight:30
    },
            img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
            imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)",
        marginBottom:50
    },
    lastdiv:{
        height:155
    },
    listItem:{
        height:80
    }
});

@observer
class Item extends Component {

    props: {
        name: string,
        rank:string,
        userid:number,
        currentuserid:number,
        navigation:any
        
    }


    @autobind @action
    toggle() {
         const {userid,navigation,name,selectkey,currentuserid,vp} = this.props;
         navigation.navigate("Topdetails",{name:name,userid:userid,currentuserid:currentuserid,key:selectkey,type:'ranklist'});
    }

    render(): React$Element<*>  {
            const {name,rank,userid,currentuserid,photo,vp} = this.props;
            const btnStyle ={ backgroundColor: this.done ? variables.brandInfo : variables.lightGray };
            return <View style={styles.listItem} >
                                                               
            {currentuserid!=userid&&<TouchableOpacity style={[Styles.center, styles.title, styles.topnames]}  onPress={this.toggle}>
                

            <View style={styles.toplist}>  

                <View style={styles.lefttop}>
                    <H3 style={styles.top_name}>{name}</H3>
                    <Text style={styles.gray}>Rank - {rank+1}</Text>
                </View>
                <View style={styles.middletop}>
                     {photo!=''&&<Image style={{width:50,height:50}} source={{uri:photo}}/>}
                {photo==''&&<Avatar size={50}/>}
                </View>
                <View>
                    <H3 style={styles.top_vp}>{vp} вп</H3>
                </View>
            </View>
            </TouchableOpacity>}

             {currentuserid==userid&&<TouchableOpacity style={[Styles.center, styles.title, styles.topnames, styles.activename]} onPress={this.toggle}>
                
               <View style={[styles.toplist, styles.activecolor]} >   
                    <View style={styles.lefttop}>
                        <H3 style={styles.top_name}>{name}</H3>
                        <Text style={styles.gray}>Rank - {rank+1}</Text>
                    </View>
                    <View style={styles.middletop}>
                         {photo!=''&&<Image style={{width:50,height:50}} source={{uri:photo}}/>}
                {photo==''&&<Avatar size={50}/>}
                    </View>
                    <View >
                        <H3 style={styles.top_vp}>{vp} вп</H3>
                    </View>
                </View>
            </TouchableOpacity>}

        </View>;

    }
}


