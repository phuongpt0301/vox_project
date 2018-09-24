// @flow
import {observable, computed} from "mobx";
import FormData from 'FormData';


export default class LoginStore {

    @observable _loading: boolean = false;
    @computed get loading(): boolean { return this._loading; }
    set loading(loading: boolean) { this._loading = loading; }

    @observable _email: string = "";
    @computed get email(): string { return this._email; }
    set email(email: string) { this._email = email; }

    @observable _password: string = "";
    @computed get password(): string { return this._password; }
    set password(password: string) { this._password = password; }




    async login(): Promise<void> {
        const {email, password} = this;
        

        try {
            if (email === "") {
                throw new Error("Please provide email address.");
            }
            if (password === "") {
                throw new Error("Please provide password.");
            }

           console.log(email);

            // var data =  new FormData();
            // data.append('security_key','ABCDEFG123456');
            // data.append('user_email','test@gmail.com');
            // data.append('user_password','password123#');
           
            
            // fetch(
            //   "http://voxapp.studiowebdemo.com/services/user_login_service.php", {
            //       method: "POST",
                 
            //       headers: {
            //         "Accept":'application/json',
            //         "Content-Type": "multipart/form-data"
            //       },
            //       body: data
            // }).then(function(response){

            //     return response.json();

            // }).then(function(data){

            //     console.log('data====',data.data);
            // })

            //return responseJson;


            //await Firebase.auth.signInWithEmailAndPassword(email, password);
            //this.loading = false;
        } catch(e) {
            this.loading = false;
            throw e;
        }
    }
}