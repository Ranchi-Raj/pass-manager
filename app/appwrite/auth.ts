import conf from '@/app/conf/conf'
import { Client, Account, ID, Databases, OAuthProvider} from 'appwrite';

export class AuthService{
    client = new Client();
    databases;
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl ? conf.appwriteUrl : "") // Your API Endpoint
            .setProject(conf.appwriteProject ? conf.appwriteProject : ""); // Your project ID
            
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }
    

    async register({email, password, name}: {email: string, password: string, name: string}) {
        try {
            const user = await this.account.create(ID.unique(), email, password,name);
            
            if(user){
                return this.login({email, password});
            }
            else 
            return user;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }

    async login ({email, password} : {email: string, password: string}) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

     loginWithGoogle(){
        try{
                this.account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/dashboard`,
                `${window.location.origin}/login`
            );
            
                return this.account.get();
           
        }
        catch(error){
            console.error("Error logging in with Google:", error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await this.account.deleteSessions();
            return response;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

}
const authService = new AuthService();
export default authService;