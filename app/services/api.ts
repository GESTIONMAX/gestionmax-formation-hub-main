"use client";

// app/services/api.ts
import axios from 'axios';

// Configuration d'axios pour utiliser les routes API Next.js
const api = axios.create({
  // Les routes API Next.js sont relatives à la racine du projet
  // Pas besoin de baseURL car nous utilisons des chemins relatifs
});

// Interception des requêtes pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Vérifier que window est défini (côté client uniquement)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
