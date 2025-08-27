import { redirect } from 'next/navigation';

export default function Home() {
  // Redirection vers la page catalogue qui semble être la page principale de l'application
  redirect('/catalogue');
}
