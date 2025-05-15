import CryptoJS from 'crypto-js';
// import conf from '../conf/conf';

class Hasher {
 async hashPassword(password: string, secretKey : string): Promise<string> {
    try{

        const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();
        return encrypted;
    }
    catch(e)
    {
        console.error("Error hashing password:", e);
        throw new Error("Hashing failed");
    }
}

 decryptPassword(encrypted: string, secretKey : string): string {
    try{

        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
    catch(e)
    {
        console.error("Error decrypting password:", e);
        throw new Error("Decryption failed");
    }
}
}

const hasher = new Hasher();
export default hasher;

