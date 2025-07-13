<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\EditProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductVariation;
use App\Models\VariationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Product;
use Inertia\Response;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 10);

        $query = Product::query();

        $products = $query->orderBy('id', 'DESC')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'per_page' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $parent_category = Category::where('parent_id', NULL)->get();
        $sub_category = Category::where('parent_id', '!=', NULL)->get();
        return Inertia::render('admin/products/create', [
            'categories' => $parent_category,
            'sub_categories' => $sub_category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        //Store Cover Image
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $product_cover_image = $file->storeAs('products/cover_image', $filename, 'public');
        }

        //Create Unqiue Slug
        $originalSlug = Str::slug($request->title);
        $slug = $originalSlug;
        $count = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        //Store Product Basic Details
        $product = Product::create([
            'title' => $request->title,
            'slug' => $slug,
            'cover_image' => $product_cover_image,
            'description' => $request->description,
            'type' => $request->type,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
        ]);

        //Check Product Type and Store Data According to type
        if ($request->type === 'simple') {
            ProductVariation::create([
                'product_id' => $product->id,
                'sizes' => $request->sizes,
                'color' => $request->color,
                'price' => $request->price,
                'sale_price' => $request->sale_price,
                'sale_start_at' => $request->sale_start_at,
                'sale_end_at' => $request->sale_end_at,
                'quantity' => $request->quantity,
            ]);
        }

        if ($request->type === 'variable' && is_array($request->variants)) {
            foreach ($request->variants as $variant) {
                // Default to null in case there's no image
                $product_variant_image = null;

                // Store Variant Data
                $product_variation = ProductVariation::create([
                    'product_id' => $product->id,
                    'image' => $product_variant_image,
                    'sizes' => is_array($variant['size']) ? $variant['size'] : [$variant['size']],
                    'color' => $variant['color'],
                    'price' => $variant['price'] ?? $request->price ?? null,
                    'sale_price' => $variant['sale_price'] ?? $request->sale_price ?? null,
                    'sale_start_at' => isset($variant['sale_price']) && $variant['sale_price'] !== null
                        ? ($variant['sale_start_at'] ?? $request->sale_start_at ?? null)
                        : null,
                    'sale_end_at' => isset($variant['sale_price']) && $variant['sale_price'] !== null
                        ? ($variant['sale_end_at'] ?? $request->sale_end_at ?? null)
                        : null,
                    'quantity' => $variant['quantity'],
                    'sku' => $variant['sku'],
                ]);

                // If image is uploaded for this variant then store in table
                if (isset($variant['image']) && $variant['image'] instanceof \Illuminate\Http\UploadedFile) {
                    $file = $variant['image'];
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $product_variant_image = $file->storeAs('products/variant_image', $filename, 'public');
                    VariationImage::create([
                        'product_variation_id' => $product_variation->id,
                        'image_path' => $product_variant_image ?? null,
                    ]);
                }
            }
        }

        return redirect()->intended(route('admin.product.index', [], false))->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = ProductVariation::where('id', $id)->with('product', 'images')->first();
        return Inertia::render('admin/products/product', [
            'variant' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $parentCategories = Category::whereNull('parent_id')->get();
        $subCategories = Category::whereNotNull('parent_id')->get();

        $product = Product::with('variations')->findOrFail($id);

        $productData = $product->toArray();

        if ($product->type === 'variable') {
            foreach ($product->variations as $index => $variation) {
                $variationImage = VariationImage::where('product_variation_id', $variation->id)->first();
                $productData['variations'][$index]['image_path'] = $variationImage?->image_path ?? null;
            }
        }

        return Inertia::render('admin/products/edit', [
            'categories' => $parentCategories,
            'sub_categories' => $subCategories,
            'product' => $productData
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        if ($product->type === 'simple') {

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'categoryId' => 'required|exists:categories,id',
                'subCategoryId' => 'nullable|exists:categories,id',
                'size' => 'required',
                'color' => ['required', 'regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
                'price' => 'required|numeric|min:0',
                'salePrice' => 'nullable|numeric|min:0',
                'quantity' => 'nullable|integer|min:0',
                'saleStartAt' => 'nullable|date|after_or_equal:today',
                'saleEndAt' => 'nullable|date|after:saleStartAt',
            ]);
        } elseif ($product->type === 'variable') {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'categoryId' => 'required|exists:categories,id',
                'subCategoryId' => 'nullable|exists:categories,id',
            ]);
        }

        $originalSlug = Str::slug($request->title);
        $slug = $originalSlug;
        $count = 1;

        while (
            Product::where('slug', $slug)
                ->where('id', '!=', $product->id)
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        // Update product
        $product->fill([
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'],
            'category_id' => $validated['categoryId'],
            'sub_category_id' => $validated['subCategoryId'],
        ])->save();

        // Update or create product variation
        $variation = ProductVariation::findOrFail(['product_id' => $product->id])->first();

        if ($product->type === 'simple') {
            $variation->fill([
                'sizes' => $validated['size'],
                'color' => $validated['color'],
                'price' => $validated['price'],
                'sale_price' => $validated['salePrice'],
                'sale_start_at' => $validated['saleStartAt'],
                'sale_end_at' => $validated['saleEndAt'],
                'quantity' => $validated['quantity'],
            ])->save();
        }

        return redirect()->back()->with('success', 'Product Updated successfully.');
    }

    public function updateVariant(Request $request, string $id)
    {
        $validated = $request->validate([
            'size' => 'required',
            'color' => ['required', 'regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'price' => 'required|numeric|min:0',
            'salePrice' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'saleStartAt' => 'nullable|date|after_or_equal:today',
            'saleEndAt' => 'nullable|date|after:saleStartAt',
        ]);

        $variant = ProductVariation::findOrFail($id);

        $variant->fill([
            'sizes' => $validated['size'],
            'color' => $validated['color'],
            'price' => $validated['price'],
            'sale_price' => $validated['salePrice'],
            'sale_start_at' => $validated['saleStartAt'],
            'sale_end_at' => $validated['saleEndAt'],
            'quantity' => $validated['quantity'],
        ])->save();

        return redirect()->back()->with('success', 'Product Variant Updated successfully.');
    }

    public function updateImage(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'type' => 'required',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        // Create Name Of Image
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();

        // For Product Cover Image
        if ($request->type == 'cover') {
            // Store Image File
            $image_name = $file->storeAs('products/cover_image', $filename, 'public');
            $product = Product::findOrFail($request->id);

            // Delete Previously Store Image File
            if ($product->cover_image) {
                Storage::disk('public')->delete($product->cover_image);
                // Update Newly Store File Path
                $product->update([
                    'cover_image' => $image_name,
                ]);
            }
        }

        // For product Variant Image
        if ($request->type == 'variant') {
            // Store File Name
            $image_name = $file->storeAs('products/variant_image', $filename, 'public');
            $variantImage = VariationImage::where('product_variation_id', $request->id)->first();

            // Delete Previously Store Image File
            if ($variantImage) {
                Storage::disk('public')->delete($variantImage->image_path);
                // Update Newly Store File Path
                $variantImage->update([
                    'image_path' => $image_name,
                ]);
            } else {
                VariationImage::create([
                    'product_variation_id' => $request->id,
                    'image_path' => $image_name,
                ]);
            }
        }

        // Redirect BacK
        return redirect()->back()->with('success', 'Product Image Updated successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        // Loop through each variation
        $productVariations = ProductVariation::where('product_id', $id)->get();

        foreach ($productVariations as $productVariation) {
            // Get the variation image (if it exists)
            $variationImage = VariationImage::where('product_variation_id', $productVariation->id)->first();

            if ($variationImage) {
                // Delete image file from storage if exists
                Storage::disk('public')->delete($variationImage->image_path);
                $variationImage->delete();
            }

            $productVariation->delete();
        }

        // Delete cover image if it exists
        if ($product->cover_image) {
            Storage::disk('public')->delete($product->cover_image);
        }

        $product->delete();

        return redirect()
            ->route('admin.product.index');
    }

    public function destroyVariant(string $id)
    {
        $variant = ProductVariation::findOrFail($id);

        $variationImage = VariationImage::where('product_variation_id', $variant->id)->first();

        if ($variationImage) {
            // Delete image file from storage if exists
            Storage::disk('public')->delete($variationImage->image_path);
            $variationImage->delete();
        }

        $variant->delete();

        return redirect()->back();
    }
}
