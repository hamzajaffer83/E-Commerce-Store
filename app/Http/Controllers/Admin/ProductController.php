<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        $parent_category = Category::where('parent_id', NULL)->get();
        $sub_category = Category::where('parent_id', '!=', NULL)->get();
        $product = Product::with('variations')->findOrFail($id);
        return Inertia::render('admin/products/edit', [
            'categories' => $parent_category,
            'sub_categories' => $sub_category,
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd($request->all());
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

        return redirect()->route('admin.product.index');
    }
}
