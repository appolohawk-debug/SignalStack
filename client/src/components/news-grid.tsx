import { Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NewsItem } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface NewsGridProps {
  newsItems: NewsItem[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function NewsGrid({ newsItems, isLoading, onLoadMore, hasMore }: NewsGridProps) {
  const handleShare = async (newsItem: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.description,
          url: newsItem.sourceUrl || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(`${newsItem.title} - ${newsItem.sourceUrl || window.location.href}`);
    }
  };

  const handleBookmark = (newsItem: NewsItem) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmarking:', newsItem.title);
  };

  if (isLoading && newsItems.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (newsItems.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No news items found</h3>
        <p className="text-signal-gray">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((newsItem) => (
          <Card key={newsItem.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`news-card-${newsItem.id}`}>
            {newsItem.imageUrl && (
              <img 
                src={newsItem.imageUrl} 
                alt={newsItem.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {newsItem.company}
                  </Badge>
                  <Badge 
                    variant={newsItem.implementationType === 'Released' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {newsItem.implementationType}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare(newsItem)}
                    className="text-signal-gray hover:text-gray-900"
                    data-testid={`share-article-${newsItem.id}`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleBookmark(newsItem)}
                    className="text-signal-gray hover:text-gray-900"
                    data-testid={`bookmark-article-${newsItem.id}`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {newsItem.title}
              </h3>
              
              <p className="text-sm text-signal-gray mb-4 line-clamp-3">
                {newsItem.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {newsItem.relevanceCategories.slice(0, 2).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-signal-gray">
                  {formatDistanceToNow(new Date(newsItem.publishedAt), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-signal-blue text-white hover:bg-blue-600"
            data-testid="load-more-button"
          >
            {isLoading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}
    </div>
  );
}
