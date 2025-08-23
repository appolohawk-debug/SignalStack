import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { NewsItem } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function TopNewsScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const { data: breakthroughNews, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news", { isBreakthrough: true, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/news?isBreakthrough=true&limit=10");
      return response.json();
    },
  });

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollerRef.current) {
        const scroller = scrollerRef.current;
        const scrollAmount = 320; // Width of one card + gap
        
        if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth) {
          scroller.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

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
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${newsItem.title} - ${newsItem.sourceUrl || window.location.href}`);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🔥 Breakthrough AI News</h2>
          </div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-80 h-48 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🔥 Breakthrough AI News</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollLeft}
              className="p-2 rounded-lg hover:bg-gray-100"
              data-testid="scroll-left-button"
            >
              <ChevronLeft className="h-4 w-4 text-signal-gray" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollRight}
              className="p-2 rounded-lg hover:bg-gray-100"
              data-testid="scroll-right-button"
            >
              <ChevronRight className="h-4 w-4 text-signal-gray" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
          data-testid="news-scroller"
        >
          {breakthroughNews?.map((newsItem, index) => {
            const gradientClasses = [
              "from-blue-50 to-indigo-50 border-blue-100",
              "from-purple-50 to-pink-50 border-purple-100",
              "from-green-50 to-emerald-50 border-green-100",
              "from-orange-50 to-red-50 border-orange-100",
              "from-teal-50 to-cyan-50 border-teal-100"
            ];
            
            const badgeColors = [
              "bg-signal-blue text-white",
              "bg-purple-600 text-white",
              "bg-green-600 text-white",
              "bg-orange-600 text-white",
              "bg-teal-600 text-white"
            ];

            return (
              <div 
                key={newsItem.id} 
                className={`flex-none w-80 bg-gradient-to-r ${gradientClasses[index % gradientClasses.length]} rounded-xl p-6 border`}
                data-testid={`breakthrough-card-${newsItem.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className={badgeColors[index % badgeColors.length]}>
                    BREAKTHROUGH
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare(newsItem)}
                    className="text-signal-gray hover:text-gray-900"
                    data-testid={`share-breakthrough-${newsItem.id}`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {newsItem.title}
                </h3>
                
                <p className="text-sm text-signal-gray mb-3 line-clamp-3">
                  {newsItem.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {newsItem.company}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {newsItem.implementationType}
                    </Badge>
                  </div>
                  <span className="text-xs text-signal-gray">
                    {formatDistanceToNow(new Date(newsItem.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
