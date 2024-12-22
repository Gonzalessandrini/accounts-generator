import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const IV_LENGTH = 16;


export function encrypt(text: string): string {

  const iv = crypto.randomBytes(IV_LENGTH); // Genera un IV único

  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');

  encrypted += cipher.final('hex');
  const asd = `${iv.toString('hex')}:${encrypted}`
  console.log(asd)

  return `${iv.toString('hex')}:${encrypted}`; // Guardamos el IV junto al texto cifrado
}

// Desencriptar
export function decrypt(encryptedText: string): string {
  const [iv, encrypted] = encryptedText.split(':'); // Separar el IV del texto cifrado
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'utf-8'),
    Buffer.from(iv, 'hex'),
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}
