// @flow
import React from "react";
import {View, ViewStylePropTypes} from "react-native";
import {Icon} from "native-base";

import commonColor from "../../native-base-theme/variables/commonColor";

const getStyle = (size: number): ViewStylePropTypes  => {
    return {
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: size / 2
    }
}

export default class Mark extends React.Component {

    render(): React$Element<View> {
        return <View style={[getStyle(230), {borderColor: "rgba(255, 255, 255, .3)", borderWidth: 2 }]}>
            <View style={[getStyle(210), { borderColor: "rgba(255, 255, 255, .5)", borderWidth: 2 }]}>
                <View style={[getStyle(180), { borderColor: "white", borderWidth: 2 }]}>
                    <View style={[getStyle(150), { backgroundColor: commonColor.white }]}>
                        <Icon name="md-checkmark" style={{fontSize: 100, color: commonColor.brandPrimary }} />
                    </View>
                </View>
            </View>
        </View>;
    }
}