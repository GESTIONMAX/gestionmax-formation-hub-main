"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import ProgrammesCatalogue from "../../components/programmes/ProgrammesCatalogue";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import React from "react";

/**
 * Page de gestion des programmes de formation
 * Permet de visualiser et gérer les programmes catalogue et sur-mesure
 * via une interface à onglets
 */
export default function ProgrammesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Programmes de Formation</h1>
      </div>
      
      <Card>
        <CardHeader className="border-b bg-muted/40">
          <CardTitle>Gestion des programmes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="catalogue" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalogue">Programmes Catalogue</TabsTrigger>
              <TabsTrigger value="sur-mesure">Programmes Sur-mesure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="catalogue" className="p-4">
              <ProgrammesCatalogue />
            </TabsContent>
            
            <TabsContent value="sur-mesure" className="p-4">
              {/* À implémenter plus tard - Version similaire au catalogue mais pour les programmes sur-mesure */}
              <div className="p-8 bg-muted/40 rounded-md text-center">
                <p>Le module de gestion des programmes sur-mesure sera disponible prochainement.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
