import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite"

export class AuthService{
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            console.log("UserCreated -: ", userAccount);
            
            if (userAccount) {
                // call login method
                return this.login({email, password})
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: CreateAccount error", error);
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("appwrite service :: login error ",error);
        }
    }

    async getCurrentUser() {
        try {
            let result = await this.account.get();
            console.log(result);
            return result
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser error ", error);
        } 

        return null;
    }  

    // isAuthenticated() {
    //     const userSession  = localStorage.getItem('appwriteSession');
    //     if(userSession) 
    //         return true

    //     return false;
    // }

    async logout() {
        try {
            // await this.account.deleteSession('current');        //deleting current seesion
            console.log('in logout func....');
            await this.account.deleteSessions();        // deleting all sessions of user
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;