'use client';

import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useBulkOrder } from '@/components/ui/modal/BulkOrderContext';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { toggleWishlistItem } from '@/store/slices/wishlist';
import { addItem } from '@/store/slices/cart';
import type { RootState } from '@/store/store';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | undefined;
  image: string;
  alt: string;
  rating: number;
  discount?: number | undefined;
  showThumbnails?: boolean | undefined;
  animationDelay?: number | undefined;
  packingStandard?: string | undefined;
}

const ProductCard = ({
  id,
  slug,
  name,
  category,
  price,
  originalPrice,
  image,
  alt,
  rating,
  discount = 0,
  showThumbnails = true,
  animationDelay: _animationDelay = 0,
  packingStandard
}: ProductCardProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCartApi] = useAddToCartMutation();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const wishlistItem = wishlistItems.find(item => item.productId === id);
  const isInWishlist = !!wishlistItem;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id).unwrap();
        dispatch(toggleWishlistItem({ id, productId: id, name, price, image }));
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ product_id: id }).unwrap();
        dispatch(toggleWishlistItem({ id, productId: id, name, price, image }));
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const packQty = packingStandard ? parseInt(packingStandard) || 1 : 1;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await addToCartApi({ product_id: id, quantity: packQty }).unwrap();
      dispatch(addItem({ id, productId: id, name, price, image, quantity: packQty }));
      toast.success(`Added ${packQty} ${packQty > 1 ? 'pcs' : 'pc'} to cart`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Top Left: Discount */}
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[10px] font-semibold text-[#1A1A2E]">
          {discount}% OFF
        </span>
      )}

      {/* Top Right: Wishlist + Cart */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow transition hover:bg-gray-100"
        >
          <Icon name="HeartIcon" size={14} className={isInWishlist ? 'text-red-500' : 'text-[#D4AF37]'} variant={isInWishlist ? 'solid' : 'outline'} />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow transition hover:bg-gray-100"
        >
          <Icon name="ShoppingCartIcon" size={14} className="text-slate-700" />
        </button>
      </div>

      {/* Image - Full width */}
      <Link href={`/product/${slug}`}>
        <div className="relative h-32 w-full overflow-hidden rounded-t-xl sm:h-44">
          <AppImage
            src={image}
            alt={alt}
            className="h-full w-full rounded-t-xl object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </div>
      </Link>

      {/* Content with padding */}
      <div className="p-3">
        {/* Thumbnails (compact) */}
        {showThumbnails && (
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-md border border-[#D4AF37] bg-gray-200" />
            <div className="h-6 w-6 rounded-md bg-gray-200" />
            <span className="text-[11px] font-medium text-[#D4AF37]">+2</span>
          </div>
        )}

        {/* Product Info */}
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {category}
        </p>

        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
          {name}
        </h3>

        {/* Rating */}
        <div className="mb-1 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="StarIcon"
              size={12}
              variant={i < Math.floor(rating) ? 'solid' : 'outline'}
              className={i < Math.floor(rating) ? 'text-[#D4AF37]' : 'text-muted-foreground'}
            />
          ))}
          <span className="text-[11px] text-muted-foreground">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Packing Standard */}
        {packingStandard && (
          <p className="mb-1 text-[10px] font-medium text-[#D4AF37]">
            Pack of {packingStandard}
          </p>
        )}

        {/* Price */}
        <div className="mb-3 flex items-baseline space-x-2">
          <span className="text-base font-semibold text-primary">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* ✅ Updated: Single Add to Cart Button (Removed Bulk Orders & WhatsApp) */}
        <button
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-[#D4AF37] py-2 text-center text-sm font-semibold text-[#1A1A2E] transition hover:bg-[#C5A035] hover:scale-[0.98]"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;