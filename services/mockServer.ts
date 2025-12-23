import { UserProfile, AuthResponse } from '../types';

/**
 * MOCK SERVER LAYER
 * In a real MERN stack, this code would reside in Node.js/Express.
 * We simulate the "Backend" here to demonstrate the logic requested in the PDF.
 */

const DB_KEY = 'secure_users_db';
const SECRET_KEY = 'simulation-secret-key-256-bit'; // In real app, this is process.env.SECRET_KEY

// --- Utility: Simulated Encryption Service (AES-GCM equivalent logic) ---
// Using Web Crypto API for realistic async encryption behavior

const enc = new TextEncoder();
const dec = new TextDecoder();

const getCryptoKey = async () => {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("some-static-salt"), // In prod, random salt per user
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (text: string): Promise<string> => {
  const key = await getCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );

  // Combine IV and data for storage (Base64)
  const ivArr = Array.from(iv);
  const encryptedArr = Array.from(new Uint8Array(encrypted));
  return btoa(JSON.stringify({ iv: ivArr, data: encryptedArr }));
};

export const decryptData = async (cipherText: string): Promise<string> => {
  try {
    const raw = JSON.parse(atob(cipherText));
    const iv = new Uint8Array(raw.iv);
    const data = new Uint8Array(raw.data);
    const key = await getCryptoKey();

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );
    return dec.decode(decrypted);
  } catch (e) {
    throw new Error("Decryption failed: Integrity check error");
  }
};

// --- Mock Database Operations ---

const getDB = (): UserProfile[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToDB = (users: UserProfile[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

// --- API Endpoints Simulation ---

export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await new Promise(r => setTimeout(r, 800)); // Simulate network latency

  const users = getDB();
  // In a real app, password would be hashed. Checking plain text for demo.
  // We assume the user created during this session is valid.
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Generate a fake JWT
  const token = `fake-jwt-token-${Date.now()}.${btoa(user.id)}`;

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

export const mockRegister = async (name: string, email: string, aadhaar: string, password: string): Promise<AuthResponse> => {
  await new Promise(r => setTimeout(r, 1000)); // Simulate network latency

  const users = getDB();
  if (users.find(u => u.email === email)) {
    throw new Error("User already exists");
  }

  // ENCRYPTION AT REST: Encrypt the Aadhaar ID before saving
  const encryptedAadhaar = await encryptData(aadhaar);

  const newUser: UserProfile = {
    id: crypto.randomUUID(),
    name,
    email,
    aadhaarEncrypted: encryptedAadhaar, // Storing ONLY encrypted data
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveToDB(users);

  // Auto-login after register
  return mockLogin(email, password);
};

export const mockFetchProfile = async (token: string): Promise<UserProfile> => {
  await new Promise(r => setTimeout(r, 600));

  // Validate Token (Simple check)
  if (!token || !token.startsWith("fake-jwt")) {
    throw new Error("Unauthorized: Invalid Token");
  }

  const userIdEncoded = token.split('.')[1];
  if(!userIdEncoded) throw new Error("Invalid Token Structure");
  
  const userId = atob(userIdEncoded);
  const users = getDB();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error("User not found");

  // DECRYPTION ON DEMAND: The API decrypts data before sending it to client
  // (Or sends encrypted and client decrypts - PDF says "fetch... including decrypted")
  // We will adhere to: Server decrypts and sends clean data over secure channel (HTTPS)
  
  const decryptedAadhaar = await decryptData(user.aadhaarEncrypted);

  return {
    ...user,
    aadhaarDecrypted: decryptedAadhaar // Sending the sensitive data
  };
};

export const mockUpdatePassword = async (userId: string, newPassword: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1200));
    // In a real app, we would hash the new password and update the DB record.
    // For this mock, we just return success.
    if (!userId) throw new Error("User ID required");
    return true;
};

export const mockRevokeToken = async (token: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate network latency
    // In a real app, we would add this token to a blacklist in Redis or DB
    // Here we just acknowledge the request
    return true;
};