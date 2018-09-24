// F1 API v6
import {AsyncStorage} from "react-native";

let helper = {
  
  async getCache(key){

       
        var value = await AsyncStorage.getItem(key);
       
        return value;

    },
    async setCache(key,data){

        var value = await AsyncStorage.setItem(key,JSON.stringify(data));

    },
    async removeCache(key){

        var value = await AsyncStorage.removeItem(key);

    }  
 
}

module.exports = helper