// @flow
import moment from "moment";
import React, {Component} from "react";
import {StyleSheet, View, Text, ScrollView} from "react-native";
import {Container, Tab, Tabs, TabHeading, H1} from "native-base";

import {BaseContainer, Task, Styles, TaskOverview} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

const DAY = 1;
const WEEK = 2;
const MONTH = 3;

export default class Overview extends Component {
    render(): React$Element<*> {
        return <BaseContainer title="Overview" navigation={this.props.navigation}>
            <Tabs>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>DAY</Text></TabHeading>}>
                    <OverviewTab period={DAY} />
                </Tab>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>WEEK</Text></TabHeading>}>
                    <OverviewTab period={WEEK} />
                </Tab>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>MONTH</Text></TabHeading>}>
                    <OverviewTab period={MONTH} />
                </Tab>
            </Tabs>
        </BaseContainer>;
    }
}

class OverviewTab extends Component {
    props: {
        period: 1 | 2 | 3
    }

    render(): React$Element<*> {
        const {period} = this.props;
        let label;
        if (period === 1) {
            label = moment().format("dddd");
        } else if (period === 2) {
            label = `Week ${moment().format("W")}`;
        } else {
            label = moment().format("MMMM");
        }
        return <Container>
            <View style={[style.tab, Styles.center]}>
                <H1>{label}</H1>
            </View>
            <TaskOverview completed={64} overdue={5} />
            <ScrollView>
                <Task date="2015-05-08 09:30" title="New Icons" subtitle="Mobile App" completed={true} />
                <Task
                    date="2015-05-08 11:00"
                    title="Design Stand Up"
                    subtitle="Hangouts"
                    collaborators={[1, 2, 3]}
                    completed={false}
                    />
                <Task date="2015-05-08 14:00" title="New Icons" subtitle="Home App" completed={true} />
                <Task date="2015-05-08 16:00" title="Revise Wireframes" subtitle="Company Website" completed={true} />
            </ScrollView>
        </Container>
    }
}

const style = StyleSheet.create({
    tabHeading: {
        color: variables.gray
    },
    tab: {
        backgroundColor: "#f8f8f8",
        padding: variables.contentPadding * 4
    }
});