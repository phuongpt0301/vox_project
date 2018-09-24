// @flow
import React, {Component} from "react";
import {Text} from "react-native";
import variables from "../../native-base-theme/variables/commonColor";

export default class Small extends Component {

    props: Text.props;

    render(): React$Element<Text> {
        return <Text style={[{ fontSize: 12, color: variables.gray }, this.props.style]}>{this.props.children}</Text>;
    }
}
