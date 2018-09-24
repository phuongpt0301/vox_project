// @flow
import React, {Component} from "react";
import {View, StyleSheet} from "react-native";

export default class Circle extends Component {

    props: {
        size: number,
        color: string,
        children?: React$Element<*>,
        style?: StyleSheet.Styles | Array<StyleSheet.Styles>
    }

    render(): React$Element<*> {
        const {size, color, style} = this.props;
        const circleStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center"
        };
        return <View style={[circleStyle, style]}>{this.props.children}</View>;
    }
}