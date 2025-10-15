import Header from '@/components/Header';
import Tabs from '@/components/Tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Submit Your Claims</h1>
        <div className="max-w-2xl mx-auto">
          <Tabs />
        </div>
      </main>
    </div>
  );
}
