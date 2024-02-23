<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductController extends AbstractController
{
    /**
     * @Route("/products-list", name="products-list", methods={"GET"})
     */
    public function getProducts(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAll();
        $productsArray = [];
        foreach ($products as $product) {
            $productsArray[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'type' => $product->getType(),
                'label' => $product->getLabel(),
                'year' => $product->getYear(),
                'country' => $product->getCountry(),
                'format' => $product->getFormat(),
                'slug' => $product->getSlug(),
                'artist' => $product->getArtist(),
                'image' => $product->getImage(),
                'quantity' => $product->getQuantity(),
            ];
        }
        return new JsonResponse($productsArray, 200);
    }


    /**
     * @Route("/product/{id}", name="product-details", methods={"GET"})
     */
    public function getProductById($id, ProductRepository $productRepository): JsonResponse
    {
        $product = $productRepository->findOneBy(['id' => $id]);

        $genres = $product->getGenre();
        $genresArray = [];

        $styles = $product->getStyle();
        $stylesArray = [];

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], 404);
        }

        foreach ($genres as $genre) {
            $genresArray[] = [
                'name' => $genre->getName(),
            ];
        }

        foreach ($styles as $style) {
            $stylesArray[] = [
                'name' => $style->getName(),
            ];
        }

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'type' => $product->getType(),
            'label' => $product->getLabel(),
            'year' => $product->getYear(),
            'country' => $product->getCountry(),
            'format' => $product->getFormat(),
            'slug' => $product->getSlug(),
            'artist' => $product->getArtist(),
            'image' => $product->getImage(),
            'quantity' => $product->getQuantity(),
            'style' => $stylesArray,
            'genre' => $genresArray,
        ];
        return new JsonResponse($data, 200);
    }
}
