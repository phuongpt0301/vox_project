// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, TouchableOpacity, Footer,ActivityIndicator, ScrollView,ListView} from "react-native";
import {H1, Button, Icon} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import {BaseContainer, Styles, Images,WindowDimensions} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Small from "../components/Small";
import api from '../Utils/api';
import helper from '../Utils/helper';

import {
  fetchDuelList,
} from "../actions/DuelAction";
import { connect } from "react-redux";

 const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
})

export class Duel extends Component {
    
    constructor(props) {
        super(props)

        this.state = {    
          loading: true,
          duelList:ds.cloneWithRows([]),
        }

       

         this.renderRow = this.renderRow.bind(this)
       
    }

     componentWillReceiveProps(nextProps) {
      // If isAFavourite is toggled, update it
      if (nextProps.duelList !== this.props.duelList) {

                var res = nextProps.duelList;
                console.log('duel===',res);
                 if(res.Result=='True'){

                    this.setState({duelList:ds.cloneWithRows(res.data)}); 

                }else{

                    this.setState({duelList:ds.cloneWithRows([])}); 
                }  

      }
    }

    componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            console.log(res);
            if(res){

                this.userData = JSON.parse(res);
                console.log('my console', res);
                this.getData(this.userData.user_id);
                
            }else{

                this.setState({loading:false}); 
            }
            
           
        })

        
    //const userdata = await AsyncStorage.getItem('@userdata'); 
    }

    onSelect = data => {
        console.log('selctstateasss');
        this.setState({loading:true});
        this.getData(this.userData.user_id);
   };


    getData(user_id){

            let data ={
                user_id:user_id
            }
            console.log(data);
            this.props.fetchDuelList('duel_list_service.php',data);

    }


    @autobind
    go() {
        this.props.navigation.navigate('Adddual', { onSelect: this.onSelect });
    }

    renderRow(rowData,sectionID,rowID) {
        return (
          <View style={Styles.listItem}>

                <TouchableOpacity style={[Styles.center, style.title, style.topnames]} onPress={() => this.toggle(rowData,sectionID,rowID)}>
                    <View>
                        <Text style={style.firstname}>{rowData.firstname}</Text>
                        <Text style={style.votes}>{rowData.firstvotes} Гласувай</Text>
                    </View>
                    <View>
                        <Text style={style.vs}>VS</Text>
                    </View>
                    <View>
                        <Text style={style.secondname}>{rowData.secondname}</Text>
                        <Text style={style.votes}>{rowData.secondvotes} Гласувай</Text>
                    </View>
                </TouchableOpacity>


            </View>
        )
    }

    @autobind
    toggle(rowData,sectionID,rowID) {
         //const {firstname,secondname,firstvotes,secondvotes,firstphoto,secondphoto,duel_id,navigation} = this.props;
         
         let data ={
            firstname:rowData.firstname,
            secondname:rowData.secondname,
            firstvotes:rowData.firstvotes,
            secondvotes:rowData.secondvotes,
            firstphoto:rowData.firstphoto,
            secondphoto:rowData.secondphoto,
            duel_id:rowData.duel_id,
            key:rowID,
            onSelect: this.onSelect
         }

         console.log(data);

         this.props.navigation.navigate("Viewdualprofile",{data});
    }

    render(): React$Element<*> {
        const {duelList, loading} = this.state;
        if (this.props.isFetching) {

            return <BaseContainer title="Дуел" navigation={this.props.navigation} scrollable>
                        
                <ScrollView >
                {
                    <View style={ Styles.flexGrow }>
                      <ActivityIndicator
                        animating={ loading }
                        style={[
                          Styles.centering,
                          { height: 80 }
                        ]} size="large" />
                    </View>
                }
                </ScrollView>
                
                </BaseContainer>;
            

        }else{
  
            return <Image source={Images.login} style={style.img} ><BaseContainer title="Дуел" navigation={this.props.navigation} >
               <ScrollView >
               <View style={style.imgMask}>
                {this.state.duelList.getRowCount()==0 && <View>

                       <Text style={{ fontSize:20,padding:20,
                     textAlign:'center'}}>Няма намерени резултати</Text>

                        </View>
                    }

               {this.state.duelList.getRowCount()>0&&<ListView

            dataSource={ duelList }
            enableEmptySections={true}
            renderRow={ this.renderRow } />}

        
        </View>

              </ScrollView >
            </BaseContainer>
                <Button primary full onPress={this.go}>
                   <Text style={style.insert}><Icon name="md-add"/> Въведи</Text>
                </Button>
            </Image>;
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
})(Duel);


const style = StyleSheet.create({
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
        insert:{
      color:'#fff',
      fontSize:25
    },
        img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
            imgMask: {
        backgroundColor: "rgba(71, 255, 247, .4)"
    }
});





