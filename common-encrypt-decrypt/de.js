// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// cons
const iv = crypto.randomBytes(16);
module.exports = {
    encrypt: async (text, iv, privateKey) => {
        try {
            // let bufferOriginal = await Buffer.from(JSON.parse(publicKey).data);
            if (text != "") {
                //Dạng mã của bản rõ ban đầu

                let cipher = await crypto.createCipheriv('aes-256-cbc', Buffer.from(privateKey), iv);
                let encrypted = await cipher.update(text);
                encrypted = await Buffer.concat([encrypted, cipher.final()]);
                let a = iv.toString('hex') + ':' + encrypted.toString('hex');
                return a;
            } else {
                return undefined;
            }
            // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
        } catch (error) {
            return { status: "fail", message: error.message };
        }
    },

    decrypt: async (text, privateKey) => {
        try {
            // let iv = await Buffer.from(text.iv, 'hex');
            // // let bufferOriginal = await Buffer.from(JSON.parse(publicKey).data);
            // let encryptedText = await Buffer.from(text.encryptedData, 'hex');
            // let decipher = await crypto.createDecipheriv('aes-256-cbc', Buffer.from(privateKey), iv);
            // let decrypted = await decipher.update(encryptedText);
            // decrypted = await Buffer.concat([decrypted, decipher.final()]);
            // return decrypted.toString();

            let textParts = text.split(':');
            let iv = await Buffer.from(textParts.shift(), 'hex');
            let encryptedText = await Buffer.from(textParts.join(':'), 'hex');
            let decipher = await crypto.createDecipheriv('aes-256-cbc', Buffer.from(privateKey), iv);
            let decrypted = await decipher.update(encryptedText);
            decrypted = await Buffer.concat([decrypted, decipher.final()]);
            let a = decrypted.toString();
            return a;


        } catch (error) {
            return { status: "fail", message: error.message };
        }
    }
}