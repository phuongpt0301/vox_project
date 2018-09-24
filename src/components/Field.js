// @flow
import * as _ from "lodash";
import autobind from "autobind-decorator";
import React, {Component} from "react";
import {ListItem, Item, Label, Input, Body, Right} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

interface FieldProps {
    label: string,
    defaultValue?: string,
    last?: boolean,
    inverse?: boolean,
    right?: () => React$Element<*>
}

@observer
export default class Field extends Component {

    props: FieldProps;
    @observable value: string;

    componentWillMount() {
        this.setValue(this.props.defaultValue || "");
    }

    @autobind @action
    setValue(value: string) {
        this.value = value;
    }

    render(): React$Element<*> {
        const {label, last, inverse, defaultValue, right} = this.props;
        const style = inverse ? { color: "white" } : {};
        const itemStyle = inverse ? { borderColor: "white" } : {};
        const keysToFilter = ["right", "defaultValue", "inverse", "label", "last"];
        const props = _.pickBy(this.props, (value, key) => keysToFilter.indexOf(key) === -1);
        const {value} = this;
        return <ListItem {...{ last }} style={itemStyle}>
            <Body>
                <Item
                    style={{ borderBottomWidth: 0 }}
                    floatingLabel={!defaultValue}
                    stackedLabel={!!defaultValue}>
                    <Label {...{ style }}>{label}</Label>
                    <Input onChangeText={this.setValue} {...{ value, style }} {...props} />
                </Item>
            </Body>
            {
                right && <Right>{right()}</Right>
            }
        </ListItem>;
    }
}