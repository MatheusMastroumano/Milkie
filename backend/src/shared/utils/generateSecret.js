// use esse arquivo para gerar uma chave JWT secreta
// e cole ela no arquivo .env

import crypto from 'crypto';

function generateSecretKey() {
    return crypto.randomBytes(64).toString('hex');
}

const secretKey = generateSecretKey();
console.log('Chave secreta gerada: ', secretKey);