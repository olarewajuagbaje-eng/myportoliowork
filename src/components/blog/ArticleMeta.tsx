import { Link } from "react-router-dom";

interface Category { id: string; name: string; slug: string; }
interface Tag { id: string; name: string; slug: string; }
interface Author { display_name: string | null; avatar_url: string | null; bio: string | null; }

export function CategoryTagChips({ category, tags }: { category: Category | null; tags: Tag[] }) {
  if (!category && tags.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {category && (
        <Link to={`/blog/category/${category.slug}`} className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition">
          {category.name}
        </Link>
      )}
      {tags.map((t) => (
        <Link key={t.id} to={`/blog/tag/${t.slug}`} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition">
          #{t.name}
        </Link>
      ))}
    </div>
  );
}

export function AuthorCard({ author }: { author: Author | null }) {
  if (!author) return null;
  return (
    <div className="glass-card rounded-2xl p-5 mt-10 flex items-start gap-4">
      {author.avatar_url ? (
        <img src={author.avatar_url} alt={author.display_name ?? ""} className="w-14 h-14 rounded-full object-cover" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary" />
      )}
      <div className="min-w-0">
        <div className="font-display font-semibold">{author.display_name ?? "Author"}</div>
        {author.bio && <p className="text-sm text-muted-foreground mt-1">{author.bio}</p>}
      </div>
    </div>
  );
}
