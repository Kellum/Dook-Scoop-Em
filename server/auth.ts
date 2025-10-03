import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { storage } from './storage';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AdminTokenPayload {
  userId: string;
  username: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (payload: AdminTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): AdminTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
};

export const requireAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify Supabase JWT token
  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
  
  if (supabaseUser && !error) {
    // Supabase token is valid
    (req as any).user = { id: supabaseUser.id, email: supabaseUser.email };
    (req as any).supabaseUser = supabaseUser;
    return next();
  }

  return res.status(401).json({ message: 'Invalid token' });
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify Supabase JWT token
  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
  
  if (error || !supabaseUser) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Check if user has admin role
  const userRole = supabaseUser.user_metadata?.role;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  (req as any).user = { id: supabaseUser.id, email: supabaseUser.email };
  (req as any).supabaseUser = supabaseUser;
  next();
};