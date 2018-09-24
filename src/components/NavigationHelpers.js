// @flow
import { NavigationActions } from "react-navigation"
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

export default class NavigationHelpers {
    static reset(navigation: NavigationScreenProp<*, *>, route: string) {
        const action = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: route })
            ]
        });
        navigation.dispatch(action);
    }
}