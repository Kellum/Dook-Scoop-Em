import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Blog() {
  const blogPosts = [
    {
      title: "The Science of Poop: Why Professional Cleanup Matters",
      excerpt: "It's not just about the smell (though that's part of it). Learn why proper waste removal is crucial for your family's health.",
      date: "March 15, 2025",
      readTime: "5 min read"
    },
    {
      title: "Training Your Dog vs. Hiring a Professional Service",
      excerpt: "Spoiler alert: Both are important! Here's how professional cleanup complements good training habits.",
      date: "March 12, 2025", 
      readTime: "3 min read"
    },
    {
      title: "Spring Cleaning: Getting Your Yard Ready for the Season",
      excerpt: "Winter is rough on yards. Here's our guide to getting your outdoor space back to pristine condition.",
      date: "March 8, 2025",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            The Scoop Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Insights, tips, and probably more poop facts than you expected. We're here to educate and entertain.
          </p>
        </section>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>
              <span className="text-orange-600 font-bold text-sm">March 15, 2025 • 5 min read</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              The Science of Poop: Why Professional Cleanup Matters
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You might think all poop cleanup is the same. You'd be wrong. Here's the scientific breakdown of why professional service isn't just about convenience - it's about health, safety, and actually getting the job done right.
            </p>
            <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
              Read Full Article
            </Button>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-sm text-orange-600 font-bold mb-2">
                {post.date} • {post.readTime}
              </div>
              <h3 className="text-xl font-black text-gray-800 leading-tight mb-4">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Button variant="outline" className="font-bold">
                Read More
              </Button>
            </div>
          ))}
        </section>

        {/* Topics We Cover */}
        <section className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Topics We Cover</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="font-black text-gray-800 mb-2">Science & Health</h3>
              <p className="text-sm text-gray-600">The facts behind proper waste management</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🐕</div>
              <h3 className="font-black text-gray-800 mb-2">Pet Care</h3>
              <p className="text-sm text-gray-600">Training tips and behavioral insights</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌿</div>
              <h3 className="font-black text-gray-800 mb-2">Yard Maintenance</h3>
              <p className="text-sm text-gray-600">Keeping your outdoor space pristine</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">😂</div>
              <h3 className="font-black text-gray-800 mb-2">Industry Humor</h3>
              <p className="text-sm text-gray-600">Because this job has its moments</p>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="text-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-gray-800 mb-4">Stay in the Loop</h2>
              <p className="text-gray-600 mb-6">
                Get the latest posts, tips, and exclusive content delivered to your inbox. We promise not to spam you (unlike some dogs we know).
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 neu-input bg-gray-100"
                />
                <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6">
                  Subscribe
                </Button>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}