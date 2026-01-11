import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface BannerPreviewProps {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  button_text: string;
  layout_type: string;
}

// Helper function to convert Google Drive links to direct image URL
const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;
  
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  
  const openPattern = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openPattern);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }
  
  const ucPattern = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = url.match(ucPattern);
  if (ucMatch) {
    return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  }
  
  return url;
};

const BannerPreview = ({ title, subtitle, image_url, link_url, button_text, layout_type }: BannerPreviewProps) => {
  const hasImage = image_url;
  const convertedImageUrl = image_url ? convertGoogleDriveUrl(image_url) : null;

  const renderPreview = () => {
    switch (layout_type) {
      case 'image_full':
        return (
          <div className="relative rounded-xl overflow-hidden">
            <div className="relative w-full aspect-[21/9]">
              {hasImage ? (
                <img 
                  src={convertedImageUrl!}
                  alt={title || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">Gambar tidak dapat dimuat</div>';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Tambahkan gambar</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'image_overlay':
        return (
          <div className="relative rounded-xl overflow-hidden min-h-[180px]">
            {hasImage ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${convertedImageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            )}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 min-h-[180px]">
              <h2 className="text-lg font-bold text-white mb-1 max-w-full leading-tight drop-shadow-lg">
                {title || 'Judul Banner'}
              </h2>
              {subtitle && (
                <p className="text-sm text-white/90 mb-3 max-w-full leading-relaxed drop-shadow">
                  {subtitle}
                </p>
              )}
              {link_url && button_text && (
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 px-4 py-1 text-xs rounded-lg shadow-md pointer-events-none"
                >
                  {button_text}
                </Button>
              )}
            </div>
          </div>
        );

      case 'image_caption':
        return (
          <div className="relative rounded-xl overflow-hidden">
            {hasImage ? (
              <>
                <div className="relative w-full aspect-[21/9]">
                  <img 
                    src={convertedImageUrl!}
                    alt={title || 'Preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">Gambar tidak dapat dimuat</div>';
                    }}
                  />
                </div>
                <div className="bg-gradient-to-r from-primary to-primary/90 px-3 py-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-white truncate">
                        {title || 'Judul Banner'}
                      </h2>
                      {subtitle && (
                        <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                          {subtitle}
                        </p>
                      )}
                    </div>
                    {link_url && button_text && (
                      <Button
                        size="sm"
                        className="bg-white text-primary hover:bg-white/90 px-3 py-1 text-xs font-semibold rounded-md shadow-md shrink-0 w-fit pointer-events-none"
                      >
                        {button_text}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-primary via-primary to-primary/80 min-h-[120px]">
                <div className="flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
                  <h2 className="text-lg font-bold text-white mb-1 max-w-full leading-tight">
                    {title || 'Judul Banner'}
                  </h2>
                  {subtitle && (
                    <p className="text-sm text-white/80 mb-3 max-w-full leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                  {link_url && button_text && (
                    <Button
                      size="sm"
                      className="bg-white text-primary hover:bg-white/90 px-4 py-1 text-xs rounded-lg shadow-md pointer-events-none"
                    >
                      {button_text}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'text_only':
      default:
        return (
          <div className="bg-gradient-to-br from-primary via-primary to-primary/80 min-h-[120px] rounded-xl overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <h2 className="text-lg font-bold text-white mb-1 max-w-full leading-tight">
                {title || 'Judul Banner'}
              </h2>
              {subtitle && (
                <p className="text-sm text-white/80 mb-3 max-w-full leading-relaxed">
                  {subtitle}
                </p>
              )}
              {link_url && button_text && (
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 px-4 py-1 text-xs rounded-lg shadow-md pointer-events-none"
                >
                  {button_text}
                </Button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Eye className="w-4 h-4" />
        <span>Preview Banner</span>
      </div>
      <div className="border border-border rounded-xl p-2 bg-muted/30">
        {renderPreview()}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Tampilan mungkin sedikit berbeda di website karena ukuran layar
      </p>
    </div>
  );
};

export default BannerPreview;
