// @flow
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {View, Text} from "react-native";
import {Switch, List, ListItem, Body, Right} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import {BaseContainer, Styles, Avatar, Field} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

export default class Settings extends Component {

    render(): React$Element<*> {
        return <BaseContainer title="Настройки" navigation={this.props.navigation} scrollable>
            <View style={[Styles.header, Styles.center, Styles.whiteBg]}>
                <Avatar size={100} />
            </View>
                <List>
                    <ListItem itemDivider>
                        <Text>GENERAL</Text>
                    </ListItem>
                    <Field label="Name" defaultValue="Marie Simpson" />
                    <Field label="Birthday" defaultValue="January 12, 1976" last />
                    <ListItem itemDivider>
                        <Text>NOTIFICATIONS</Text>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text>Email Notification</Text>
                        </Body>
                        <Right>
                            <SettingsSwitch />
                        </Right>
                    </ListItem>
                    <ListItem last>
                        <Body>
                            <Text>Phone Notification</Text>
                        </Body>
                        <Right>
                            <SettingsSwitch />
                        </Right>
                    </ListItem>
                </List>
        </BaseContainer>;
    }
}

@observer
class SettingsSwitch extends Component {

    @observable value: boolean = true;

    @autobind @action
    toggle() {
        this.value = !this.value;
    }

    render(): React$Element<*> {
        return <Switch
            value={this.value}
            onValueChange={this.toggle}
            onTintColor="rgba(80, 210, 194, .5)"
            thumbTintColor={this.value ? variables.brandInfo : "#BEBEC1"}
        />;
    }

}