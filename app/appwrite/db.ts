import conf from '@/app/conf/conf'
import { Client, Account, ID, Databases, Query,} from 'appwrite';

export class DBService{
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

    async createUser({email, password, name}:{email: string, password: string, name : string}) {

        try{

            const data = this.databases.createDocument(
                conf.appwriteDatabase ? conf.appwriteDatabase : "",
                conf.appwriteUsers ? conf.appwriteUsers : "",
            ID.unique(),
            {
                email: email,
                password: password,
                name: name,
                websitePasswords: [],
            }
        );
        return data;
    }
    catch (error) {
        console.error("Error registering user:", error);
        throw error; 
    }
    }

    async searchUser(email: string){
        try{
            const data = await this.databases.listDocuments(
                conf.appwriteDatabase ? conf.appwriteDatabase : "",
                conf.appwriteUsers ? conf.appwriteUsers : "",
                [
                    Query.equal("email", email)
                ]
            );
            if(data.documents.length > 0){
                return true;
            }
            else{
                return false;
            }
        }
        catch (error) {
            console.error("Error checking user:", error);
            throw error; 
        }
    }

    async addPassword({email, passToAdd} : {email: string, passToAdd: string[]}){
        try{
            
            const user = await this.databases.listDocuments(
                conf.appwriteDatabase ? conf.appwriteDatabase : "",
                conf.appwriteUsers ? conf.appwriteUsers : "",
                [
                    Query.equal("email", email)
                ]
            );

            console.log(user.documents[0])

            const updatedData = await this.databases.updateDocument(
                conf.appwriteDatabase ? conf.appwriteDatabase : "",
                conf.appwriteUsers ? conf.appwriteUsers : "",
                user.documents[0].$id,
                {
                    websitePasswords: passToAdd
                }
            );
            return updatedData
            
           
        }
        catch (error) {
            console.error("Error adding password:", error);
            throw error; 
        }
    }

    async getUser(email: string){
        try{
            const data = await this.databases.listDocuments(
                conf.appwriteDatabase ? conf.appwriteDatabase : "",
                conf.appwriteUsers ? conf.appwriteUsers : "",
                [
                    Query.equal("email", email)
                ]
            );
            return data.documents[0];
        }
        catch (error) {
            console.error("Error getting user:", error);
            throw error; 
        }
    }
}

const dbservice = new DBService();
export default dbservice