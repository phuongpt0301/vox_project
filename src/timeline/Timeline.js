// @flow
import moment from "moment";
import React, {Component} from "react";
import {StyleSheet, Image, View, Text} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Styles, Images, Avatar, Task} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

export default class Timeline extends Component {
    render(): React$Element<*> {
        return <BaseContainer title="Timeline" navigation={this.props.navigation} scrollable>
            <Image source={Images.timeline} style={Styles.header}>
                <View style={[Styles.imgMask, Styles.center, Styles.flexGrow]}>
                    <Avatar size={50} />
                    <H1 style={StyleSheet.flatten(style.heading)}>{moment().format("MMMM")}</H1>
                    <Text style={Styles.whiteText}>69 EVENTS</Text>
                </View>
            </Image>
            <Task date="2015-05-08 09:30" title="New Icons" subtitle="Mobile App" completed timeline />
            <Task
                date="2015-05-08 11:00"
                title="Design Stand Up"
                subtitle="Hangouts"
                collaborators={[1, 2, 3]}
                timeline
            />
            <Task date="2015-05-08 14:00" title="New Icons" subtitle="Home App" completed timeline />
            <Task date="2015-05-08 16:00" title="Revise Wireframes" subtitle="Company Website" completed timeline />
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    heading: {
        marginTop: variables.contentPadding * 2,
        color: "white"
    }
});