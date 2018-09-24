// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {KeyboardAvoidingView, ScrollView, Image, StyleSheet,BackHandler} from "react-native";
import {Container, Button, Header as NBHeader, Left, Body, Title, Right, Icon, View, TouchableOpacity, Text} from "native-base";

import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";
import Modal from 'react-native-modal'
import { Images, NavigationHelpers, WindowDimensions} from "../components";
import Avatar from "./avatar/Avatar";
import variables from "../../native-base-theme/variables/commonColor";
import helper from '../Utils/helper';

export default class BaseContainer extends Component {

      state = {
    isModalVisible: false
  }


  _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () => this.setState({ isModalVisible: false });

  componentWillMount() {

        helper.getCache('@userdata').then((res) => {

            console.log(res);
            if(res){

                this.userData = JSON.parse(res);

            }

        })

    }
    autobind
    goprofile() {
        
       this._hideModal();
       this.props.navigation.navigate('Profile',{'current_id':this.userData.user_id});
    }

    autobind
    gowallet() {   
        
        this._hideModal();
        this.props.navigation.navigate('Wallet');
    }

    autobind
    goterms() {   
        
        this._hideModal();
        this.props.navigation.navigate('Terms');
    }

    autobind
    goexit() {
        
        this._hideModal();
        BackHandler.exitApp();
    }    

    props: {
        title: string | React$Element<*>,
        navigation: NavigationScreenProp<*, *>,
        scrollable?: boolean,
        children?: React$Element<*>,
    }

    render(): React$Element<*> {
        const {title, navigation, scrollable} = this.props;
        return <Container>

                <NBHeader noShadow>
                    <Left>
                        <Button onPress={() => navigation.navigate("DrawerOpen")} transparent>
                            <Icon name="menu" style={{ color: variables.gray, fontSize: 35 }} />
                        </Button>
                    </Left>
                    <Body>
                    {
                        typeof(title) === "string" ? <Title>{title}</Title> : title
                    }
                    </Body>
                    <Right style={{ alignItems: "center" }}>
                        <Button onPress={() => this._showModal()} transparent>
                            <Icon name="md-more" style={{ color: variables.gray, fontSize: 35 }} />
                        </Button>

                    </Right>
                </NBHeader>
                {
                    scrollable ? <ScrollView style={{ backgroundColor: "white" }}>
                            <KeyboardAvoidingView behavior="position">{this.props.children}</KeyboardAvoidingView>
                        </ScrollView>
                    :
                        this.props.children
                }

                 <Modal isVisible={this.state.isModalVisible} >

                                
                                            <View style={style.row}>
                                                <Button transparent >
                                                    <Icon name="ios-close-outline" style={StyleSheet.flatten(style.closeIcon)} onPress={() => this._hideModal()} />
                                                </Button>

                                            </View>

                                            <View style={style.drawerItemsContainer}>
                                                <View style={style.drawerItems}>
                                                <Text style={style.drawerItemsinner} onPress={this.goprofile.bind(this)}>Профил</Text>
                                                <Text style={style.drawerItemsinner} onPress={this.gowallet.bind(this)}>Портфейл</Text>
                                                <Text style={style.drawerItemsinner} onPress={this.goterms.bind(this)}>Условия на играта</Text>
                                                <Text style={style.drawerItemsinner} onPress={this.goexit.bind(this)}>Изход</Text>
                                                </View>
                                                
                                            </View>
           
                                </Modal>
                           
            </Container>;



    }
}

const style = StyleSheet.create({
    img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
        container: {
        backgroundColor: "rgba(101, 99, 164, .9)",

    },
        mask: {
        color: "rgba(255, 255, 255, .5)"
    },
    closeIcon: {
        fontSize: 50,
        color: "rgba(255, 255, 255, .5)"
    },
        row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
        drawerItemsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: variables.contentPadding * 6
    },
    drawerItems: {
        flex: 1
    },
    drawerIcon: {
        justifyContent: "center",
        alignItems: "center"
    },
    drawerItemsinner:{
        fontSize:22,
        color:'#fff',
        backgroundColor:'#00CE9F',
        borderRadius:3,
        margin:10,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});