import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, action } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (action === 'register') {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 400 }
        );
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || ''
        }
      });

      // Générer un token JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } else {
      // Connexion
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      // Générer un token JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'authentification' },
      { status: 500 }
    );
  }
}
