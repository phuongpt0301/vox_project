// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Image, StyleSheet, KeyboardAvoidingView, ScrollView ,Text, Picker} from "react-native";
import {H1} from "native-base";
import {Container, Button, Header, Left, Right, Body, Icon, Title} from "native-base";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import { Col, Row, Grid } from 'react-native-easy-grid';
import {BaseContainer, Avatar, TaskOverview, Small, Styles, Task, Field, NavigationHelpers} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

export default class Adddualprofile extends Component {

    props: {
        navigation: NavigationScreenProp<*, *>
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    render(): React$Element<*> {
        return <Container>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Add Dual Profile</Title>
                </Body>
                <Right />
            </Header>
            <ScrollView style={{ backgroundColor: "white", flex: 1 }} >
               <Grid>
              <Col style={{ backgroundColor: '#635DB7', height: 250,justifyContent: 'center',
                  alignItems: 'center'}}>
                <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  <Picker style={{ borderColor: '#635DB7',  flex:1}}>
                    <Picker.Item label="Профил" value="Профил" />
                    <Picker.Item label="Username1" value="Username1" />
                    <Picker.Item label="Username2" value="Username2" />
                    <Picker.Item label="Username3" value="Username3" />
                    <Picker.Item label="Username4" value="Username4" />
                    <Picker.Item label="Username5" value="Username5" />
                    <Picker.Item label="Username6" value="Username6" />
                  </Picker>
                </View>
                <Avatar size={120}/>
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>Name : Username</Text>
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>Camera : <Icon name="camera" size={30} color={variables.white} /></Text>
              </Col>
              <Col style={{ backgroundColor: '#00CE9F', height: 250, justifyContent: 'center',
                  alignItems: 'center'}}>
                  <View style={{ flex:1, flexDirection:'row', height: 20}}>
                  <Picker style={{ borderColor: '#635DB7',  flex:1}}>
                    <Picker.Item label="Профил" value="Профил" />
                    <Picker.Item label="Username1" value="Username1" />
                    <Picker.Item label="Username2" value="Username2" />
                    <Picker.Item label="Username3" value="Username3" />
                    <Picker.Item label="Username4" value="Username4" />
                    <Picker.Item label="Username5" value="Username5" />
                    <Picker.Item label="Username6" value="Username6" />
                  </Picker>
                </View>
                <Avatar size={120}/>
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>Name : Username</Text>
                <Text style={{ color:'#fff', fontSize:18, padding:10}}>Camera : <Icon name="camera" size={30} color={variables.white} /></Text>
              </Col>
            </Grid>

            <Grid>
                <Col style={{ height: 100, justifyContent: 'center',
                    alignItems: 'center' }}>  
                    <Text style={{padding:20, borderRadius:100, backgroundColor: '#635DB7', color: '#fff', fontSize:20, fontWeight:'bold'}}>вп</Text>
                </Col>
                <Col style={{ padding:10, borderRadius:100, height: 100, justifyContent: 'center',
                    alignItems: 'center' }}>
                    <Text style={{padding:20, borderRadius:100, backgroundColor: '#00CE9F', color: '#fff', fontSize:20, fontWeight:'bold'}}>вп</Text>
                </Col>
              </Grid>
              <Grid>
                <Col style={{ height: 100, justifyContent: 'center',
                    alignItems: 'center' }}>  
                    <Text style={{color: 'red', fontSize:30, fontWeight:'bold'}}>Points</Text>
                </Col>
              </Grid>
                  
            </ScrollView>
                        <Text style={{backgroundColor:'#fff', color: '#00CE9F', fontSize:22, padding:10, fontWeight:'bold'}}>вп : 30</Text>

            <Button primary full style={{ height: variables.footerHeight }}>
               <Text style={{ color:'#fff' }}>запази</Text>
            </Button>
        </Container>;
    }
}

const style = StyleSheet.create({
    circle: {
        backgroundColor: "white",
        height: 125,
        width: 125,
        borderRadius: 62.5,
        justifyContent: "center",
        alignItems: "center"
    }
});