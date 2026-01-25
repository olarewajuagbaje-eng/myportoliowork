import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Clock, Tag, Code2, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Why Number() Casting Saves Your Paystack Workflows",
    slug: "number-casting-paystack",
    excerpt: "String-to-number mismatches cause silent failures in payment verification. Learn how explicit Number() type-casting prevents revenue leakage and ensures accurate payment validation.",
    category: "E-commerce Automation",
    readTime: "5 min read",
    icon: Code2,
    featured: true,
  },
  {
    id: 2,
    title: "Building RAG Chatbots with Postgres Memory in n8n",
    slug: "rag-chatbots-postgres",
    excerpt: "Context-aware AI chatbots need persistent memory. Discover how to implement Retrieval-Augmented Generation using Postgres Chat Memory for intelligent lead capture.",
    category: "AI & LLMs",
    readTime: "8 min read",
    icon: Zap,
  },
  {
    id: 3,
    title: "The Split-Aggregate Pattern for Content Repurposing",
    slug: "split-aggregate-pattern",
    excerpt: "Transform long-form content into platform-optimized posts. Master the Split Out → Process → Aggregate pattern for automated content distribution across social channels.",
    category: "Content Automation",
    readTime: "6 min read",
    icon: Shield,
  },
];

const BlogCard = ({ post, index, isInView }: { post: BlogPost; index: number; isInView: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className={`glass-card p-6 hover-lift group ${post.featured ? 'md:col-span-2 border-primary/30' : ''}`}
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${post.featured ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-muted'}`}>
        <post.icon className={`w-6 h-6 ${post.featured ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
        >
          Read Guide
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </motion.article>
);

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Technical <span className="gradient-text">Guides</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into automation patterns, AI integration, and workflow optimization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} isInView={isInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground mb-4">
            More technical guides coming soon
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:bg-muted transition-colors font-medium"
          >
            View All Guides
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
