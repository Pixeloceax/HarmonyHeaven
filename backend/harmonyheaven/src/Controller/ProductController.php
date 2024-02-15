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
        foreach($products as $product) {
            $productsArray[] =  [
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
}
