// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text, ScrollView, Dimensions} from "react-native";
import {Container, Button, Header, Left, Right, Icon} from "native-base";

import {Images, WindowDimensions} from "../components";


export default class Terms extends Component {
    
    @autobind
    back() {
        this.props.navigation.goBack();
    }

    render(): React$Element<*> {
        const screenWidth = Dimensions.get('window').width;

       

            return <Image source={Images.drawer} style={style.img}>
        <Container style={StyleSheet.flatten(style.container)}>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>            
                <Right />
            </Header>
        
            <View style={{justifyContent:'center', alignItems:'center', padding: 20, width: screenWidth }}>
                <ScrollView><View>
                
                <Text style={{marginBottom: 20}}>Условия на играта:</Text> 
                <Text>1. При регистрация получавате 100 VP жетона.</Text>
                <Text>2. Всеки ден, в който посетите приложението получавате 10 VP жетона дневен бонус.</Text>
                <Text>3. 1 VP жетон ви дава право на 1 глас - съответно от 10, 5, -5, -10  VP точки.</Text>  
                <Text>4. Рейтингът  се измерва от броя на получените при гласуване VP точки разделен на броя на гласувалите.</Text> 
                <Text>5. При гласуване на двама потребители един за друг броя  на VP точките, които са си дали се удвоява.</Text> 
                <Text>6. Когато задавате "ДУЕЛ" вие заплащате за него от своите VP жетони. За всеки VP жетон вие получавате 1 отговор.</Text> 
                <Text>7. Когато  гласувате за дуел вие получавате 1 VP жетон към вашия баланс. 1 VP жетон  =  1  отговор.</Text>                
            </View></ScrollView>
            </View>
             
            </Container>
            </Image>

            
    }
}

const style = StyleSheet.create({
    img: {
        resizeMode: "cover",
        ...WindowDimensions
    },
    container: {
        backgroundColor: "rgba(80, 210, 194, .5)"
    }
});