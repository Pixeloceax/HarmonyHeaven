<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UserRepository;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\ProductRepository;
use App\Repository\GenreRepository;
use App\Repository\StyleRepository;

#[IsGranted('ROLE_ADMIN', message: 'Only admin can access this route')]
class AdminBoardController extends AbstractController
{

    // ---------- USER CRUD ADMIN ----------

    /**
     * @Route("/admin/users", name="getAllUsers", methods={"GET"})
     */
    public function getAllUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        $usersArray = [];
        foreach ($users as $user) {
            if (
                $user->getRoles() != [
                    "ROLE_ADMIN",
                    "ROLE_USER"
                ]
            ) {
                $usersArray[] = [
                    'name' => $user->getName(),
                    'user' => $user->getEmail(),
                    'address' => $user->getAddress(),
                    'phone' => $user->getPhone(),
                ];
            }
        }
        return new JsonResponse($usersArray, 200);
    }


    // ---------- PRODUCT CRUD ADMIN ----------

    /**
     * @Route("/admin/products", name="getAllProducts", methods={"GET"})
     */
    public function getAllProducts(
        ProductRepository $productRepository,
        GenreRepository $genreRepository,
        StyleRepository $styleRepository
    ): JsonResponse {
        $products = $productRepository->findAll();

        $productsArray = [];

        foreach ($products as $product) {
            $genres = $product->getGenre()->toArray();
            $styles = $product->getStyle()->toArray();

            $genresArray = array_map(function ($genre) {
                return ['name' => $genre->getName()];
            }, $genres);

            $stylesArray = array_map(function ($style) {
                return ['name' => $style->getName()];
            }, $styles);

            $productsArray[] = [
                'id' => $product->getId(),
                'image' => $product->getImage(),
                'name' => $product->getName(),
                'slug' => $product->getSlug(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'quantity' => $product->getQuantity(),
                'type' => $product->getType(),
                'label' => $product->getLabel(),
                'year' => $product->getYear(),
                'country' => $product->getCountry(),
                'format' => $product->getFormat(),
                'artist' => $product->getArtist(),
                'genre' => $genresArray,
                'style' => $stylesArray,
            ];
        }

        return new JsonResponse($productsArray, 200);
    }
}
