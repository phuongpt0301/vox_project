// @flow
import moment from "moment";
import React, {Component} from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3} from "native-base";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";

export default class Task extends Component {

    props: {
        date: string,
        title: string,
        subtitle: string,
        collaborators: number[],
        completed?: boolean,
        timeline?: boolean
    }

    static defaultProps = {
        collaborators: []
    }

    render(): React$Element<*> {
        const {title, subtitle, collaborators, completed, timeline} = this.props;
        const date = moment(this.props.date);
        const height = collaborators.length > 1 ? 150 : 100;
        return <View style={[Styles.listItem, { height }]}>
            {
                timeline && <TaskStatus {...{ timeline, completed, height }} />
            }

            <View style={style.title}>
                <H3>{title}</H3>
                <Text style={style.gray}>{subtitle}</Text>
                <View style={style.row}>
                {
                    collaborators.map((id, key) => <Avatar {...{ id, key }} style={style.avatar} />)
                }
                </View>
            </View>
            {
                !timeline && <TaskStatus {...{ completed, height }} />
            }
        </View>;
    }
}

class TaskStatus extends Component {

    props: {
        timeline?: boolean,
        completed?: boolean,
        height: number
    }

    render(): React$Element<*> {
        const {timeline, completed, height} = this.props;
        return <View style={[style.doublePadding, Styles.center]}>
            {
                timeline && <View style={[{ height }, style.verticalLine]}></View>
            }
            <Circle size={10} color={completed ? variables.brandInfo : variables.brandSecondary}/>
        </View>;
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    doublePadding: {
        padding: variables.contentPadding * 2
    },
    gray: {
        color: variables.gray
    },
    avatar: {
        marginTop: variables.contentPadding,
        marginRight: variables.contentPadding
    },
    verticalLine: {
        borderLeftWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        position: "absolute"
    },
    time: {
        alignItems: "center",
        flexDirection: "row",
        padding: variables.contentPadding
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: variables.contentPadding
    }
});