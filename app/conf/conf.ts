

const conf = {
    appwriteUrl : String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProject : String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT),
    appwriteDatabase : String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE),
    appwriteUsers : String(process.env.NEXT_PUBLIC_APPWRITE_USERS),
    appwritePasswords : String(process.env.NEXT_PUBLIC_APPWRITE_PASSWORD),
    secretKey : String(process.env.HASHER_SECRET_KEY)
}

export default conf;