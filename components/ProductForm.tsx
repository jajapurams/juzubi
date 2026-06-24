import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import SlugFields from "./SlugFields";
import PrefillFromLast from "./PrefillFromLast";
import CategorySelect from "./CategorySelect";
import PriceFields from "./PriceFields";

type ProductFormValues = {
  id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  subcategory?: string; // legacy single value (migrated to subcategories)
  subcategories?: string[];
  sizes?: string[];
  price?: number;
  mrp?: number | null;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  description?: string;
  image?: string;
  images?: string[];
  in_stock?: boolean;
  sort_order?: number;
};

const inputCls = "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand";

export default function ProductForm({
  action,
  product,
  submitLabel,
  error,
  rememberLast = false,
}: {
  action: (fd: FormData) => void | Promise<void>;
  product?: ProductFormValues;
  submitLabel: string;
  error?: string;
  rememberLast?: boolean;
}) {
  const p = product ?? {};
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      {rememberLast && <PrefillFromLast />}
      {p.id && <input type="hidden" name="id" value={p.id} />}

      {/* Left: product details */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <SlugFields initialName={p.name ?? ""} initialSlug={p.slug ?? ""} inputCls={inputCls} />
        <CategorySelect
          initialCategory={p.category}
          initialSubcategories={p.subcategories ?? (p.subcategory ? [p.subcategory] : [])}
          initialSizes={p.sizes}
          inputCls={inputCls}
        />
        <label className="text-sm font-medium text-ink">
          Brand (optional)
          <input name="brand" defaultValue={p.brand ?? ""} placeholder="Leave blank if none" className={inputCls} />
        </label>
        <PriceFields initialPrice={p.price} initialMrp={p.mrp} inputCls={inputCls} />
        <label className="text-sm font-medium text-ink">
          Badge (optional)
          <input name="badge" defaultValue={p.badge ?? ""} placeholder="e.g. New, Bestseller" className={inputCls} />
        </label>
        <label className="text-sm font-medium text-ink">
          Rating (0–5)
          <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={p.rating ?? 4.5} className={inputCls} />
        </label>
        <label className="text-sm font-medium text-ink">
          Reviews count
          <input name="reviews" type="number" min="0" defaultValue={p.reviews ?? 0} className={inputCls} />
        </label>
        <label className="text-sm font-medium text-ink">
          Sort order
          <input name="sort_order" type="number" defaultValue={p.sort_order ?? 0} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-ink">
          <input name="in_stock" type="checkbox" defaultChecked={p.in_stock ?? true} className="h-4 w-4" />
          In stock (visible)
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Description
          <textarea name="description" rows={3} defaultValue={p.description ?? ""} className={inputCls} />
        </label>
        {error && <p className="text-sm text-sale sm:col-span-2">{error}</p>}
      </div>

      {/* Right: images + save */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-ink">
          Main image
          <div className="mt-1">
            <ImageUploader name="image" initial={p.image} />
          </div>
        </div>
        <div className="text-sm font-medium text-ink">
          Gallery — extra angles (optional)
          <div className="mt-1">
            <GalleryUploader name="images" initial={p.images} />
          </div>
        </div>
        <button type="submit" className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
