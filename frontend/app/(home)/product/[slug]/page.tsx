'use client';

import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Product} from '@/types/data';
import {Variation} from '@/types/helper';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import Image from 'next/image';
import {ShoppingCart} from 'lucide-react';
import {useAppDispatch} from '@/redux/hooks';
import QuantityButton from '@/components/quantity-button';
import {addToCart} from '@/redux/cartSlice';
import {toast} from "react-toastify";
import {getLocalStorageSessionId, getLocalStorageUser} from "@/lib/service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

export default function SingleProduct() {
    const {slug} = useParams() as { slug: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!slug) return;

        fetch(`${apiUrl}/api/product/${slug}`, {
            next: {revalidate: 3600},
            headers: {
                'ApiSecretKey': apiSecretKey,
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 'success') {
                    const prod: Product = res.data;
                    setProduct(prod);
                    setSelectedImage(prod.cover_image);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch product data:', err);
                setLoading(false);
            });
    }, [slug]);

    const handleShowImage = (image: string) => {
        setSelectedImage(image);
    };

    if (loading) {
        return (
            <section className="p-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <Skeleton className="h-[400px] w-full md:w-1/2"/>
                    <div className="w-full md:w-1/2 space-y-4">
                        <Skeleton className="h-10 w-3/4"/>
                        <Skeleton className="h-6 w-full"/>
                        <Skeleton className="h-6 w-1/2"/>
                        <Skeleton className="h-12 w-1/3"/>
                    </div>
                </div>
            </section>
        );
    } else if (!product) {
        return (
            <section className="flex justify-center items-center h-[80vh]">
                <h1 className="text-2xl">Product Not Found</h1>
            </section>
        )
    }

    const allImages = [
        // {id: 'cover', path: product.cover_image},
        ...product.images.map((img) => ({id: img.id, path: img.path})),
    ];

    const handleAddToCart = async () => {
        let productVariationId: number | null = null;

        // Set productVariationId based on a product type
        if (product.type === 'simple') {
            productVariationId = product.variations[0]?.id || null;
        } else {
            productVariationId = selectedVariation?.id || null;
        }

        if (!productVariationId) {
            toast.error('Please select a product variation.');
            return;
        }

        const user = getLocalStorageUser();
        const user_id = user?.id;
        const session_id = getLocalStorageSessionId();

        const payload: any = {
            cartItem: [
                {
                    product_variation_id: productVariationId,
                    quantity,
                },
            ],
        };

        if (user_id) {
            payload.user_id = user_id;
        } else {
            payload.session_id = session_id;
        }

        try {
            const res = await fetch(`${apiUrl}/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ApiSecretKey': apiSecretKey,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || 'Failed to add to cart');

            // Dispatch to Redux
            // @ts-ignore
            dispatch(addToCart({product_variation_id: productVariationId, quantity}));

            toast.success('Product added to cart');
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        }
    };

    return (
        <section className="p-6 md:p-12">
            <div className="flex flex-col md:flex-row gap-4">

                {/* Mobile: Carousel */}
                <div className="w-full md:hidden">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Image
                                    src={`${apiUrl}/storage/${selectedImage || product.cover_image}`}
                                    alt="Product Image"
                                    width={600}
                                    height={600}
                                    className="rounded-2xl object-cover w-full h-[400px]"
                                />
                            </CarouselItem>
                            {allImages.map((img) => (
                                <CarouselItem key={img.id}>
                                    <Image
                                        src={`${apiUrl}/storage/${img.path}`}
                                        alt="Product Image"
                                        width={600}
                                        height={600}
                                        className="rounded-2xl object-cover w-full h-[400px]"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Social Link for Mobile */}
                <div className="w-full flex justify-center md:hidden ">
                    <div className="flex gap-3">
                        {product.social_links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                <Image src={`/${link.platform}.png`} alt={link.platform} height={20} width={20}/>
                            </a>

                        ))}
                    </div>
                </div>

                {/* Desktop: Image + thumbnails */}
                <div className="hidden md:block w-full md:w-1/2">
                    <Image
                        src={`${apiUrl}/storage/${selectedImage}`}
                        alt={product.title}
                        width={600}
                        height={600}
                        className="rounded-2xl object-cover"
                    />
                    <div className="flex mt-4 gap-2 overflow-auto">
                        {product.images.map((img) => (
                            <Image
                                key={img.id}
                                src={`${apiUrl}/storage/${img.path}`}
                                alt="Product thumbnail"
                                width={100}
                                height={100}
                                onClick={() => handleShowImage(img.path)}
                                role="button"
                                className="rounded-md cursor-pointer object-cover border-2 hover:border-primary transition"
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{product.title}</h1>
                    <div
                        className="prose prose-neutral max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{__html: product.description}}
                    />

                    {/* Pricing */}
                    <div className="text-2xl font-semibold text-primary">
                        {product.type === 'variable' ? (
                            selectedVariation?.sale_price ? (
                                    <>
                                        {selectedVariation.price && (
                                            <span className="line-through text-muted-foreground mr-2">
                                    ${selectedVariation.price}
                                  </span>
                                        )}

                                        {selectedVariation.sale_price && (
                                            <span>${selectedVariation.sale_price}</span>
                                        )}
                                    </>
                                ) :
                                selectedVariation?.price && (
                                    <span>${selectedVariation?.price}</span>
                                )
                        ) : product.variations[0].sale_price ? (
                            <>
                            <span className="line-through text-muted-foreground mr-2">
                            ${product.variations[0].price}
                    </span>
                                <span>${product.variations[0].sale_price}</span>
                            </>
                        ) : (
                            <span>${product.variations[0].price}</span>
                        )}
                    </div>

                    {/* Variations */}
                    {product.type === 'variable' && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Choose Color</h3>
                            <div className="flex gap-2">
                                {product.variations.map((variation) => (
                                    <Button
                                        key={variation.id}
                                        variant={variation.id === selectedVariation?.id ? 'default' : 'outline'}
                                        onClick={() => {
                                            setSelectedVariation(variation);
                                            if (variation.images) {
                                                setSelectedImage(variation.images.image_path);
                                            } else {
                                                setSelectedImage(product.cover_image);
                                            }
                                        }}
                                    >
                                        {variation.color}
                                    </Button>
                                ))}
                            </div>

                            {selectedVariation && selectedVariation.sizes.length > 0 && (
                                <>
                                    <h3 className="font-medium">Available Sizes</h3>
                                    <div className="flex gap-2">
                                        {selectedVariation.sizes.map((size: string) => (
                                            <Badge key={size} variant="secondary">
                                                {size}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Simple product sizes */}
                    {product.type === 'simple' && (
                        <>
                            <h3 className="font-medium">Available Sizes</h3>
                            <div className="flex gap-2">
                                {Array.isArray(product.variations?.[0]?.sizes) ? (
                                    product.variations[0].sizes.map((size) => (
                                        <Badge key={size} variant="secondary">
                                            {size}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="secondary">
                                        {product.variations?.[0]?.sizes || 'N/A'}
                                    </Badge>
                                )}
                            </div>
                        </>
                    )}


                    {product.type === 'simple' ? (
                        <>
                            <Badge
                                className={`bg-gray-200 ${product.variations[0].quantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                {product.variations[0].quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <div
                                className={`flex flex-row items-center gap-2 w-fit  ${product.variations[0].quantity > 0 ? '' : 'pointer-events-none opacity-50'}`}
                            >
                                <QuantityButton
                                    quantity={quantity}
                                    onIncrease={() => setQuantity(prev => prev + 1)}
                                    onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    max={product.variations[0].quantity}
                                />

                                {/* CTA */}
                                <Button className="" size="lg" onClick={handleAddToCart}>
                                    <ShoppingCart className="mr-2" size={18}/>
                                    Add to Cart
                                </Button>
                            </div>
                        </>
                    ) : selectedVariation && (
                        <>
                            <Badge
                                className={`bg-gray-200 ${selectedVariation?.quantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                {selectedVariation?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <div
                                className={`flex flex-row items-center gap-2 w-fit  ${selectedVariation?.quantity > 0 ? '' : 'pointer-events-none opacity-50'}`}>
                                <QuantityButton
                                    quantity={quantity}
                                    onIncrease={() => setQuantity(prev => prev + 1)}
                                    onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    max={selectedVariation?.quantity}
                                />

                                {/* CTA */}
                                <Button className="" size="lg" onClick={handleAddToCart}>
                                    <ShoppingCart className="mr-2" size={18}/>
                                    Add to Cart
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Social Links */}
                    <div className="mt-6 hidden md:block ">
                        <div className="flex gap-3">

                            {product.social_links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    <Image src={`/${link.platform}.png`} alt={link.platform} height={20} width={20}/>
                                </a>

                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

