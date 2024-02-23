<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Wishlist;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use App\Repository\WishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class WishlistController extends AbstractController
{
        /**
         * @Route("/wishlist", name="wishlist", methods={"POST"})
         */
        public function addToWishlist(
            Request $request,
            UserRepository $userRepository,
            ProductRepository $productRepository,
            EntityManagerInterface $entityManager,
            JWTEncoderInterface $jwtEncoder
        ): JsonResponse {
            $authHeader = $request->headers->get('Authorization');
            $authToken = str_replace('Bearer ', '', $authHeader);
            $decodedJwtToken = $jwtEncoder->decode($authToken);
            $userId = $decodedJwtToken['id'];
            $user = $userRepository->findOneBy(['id' => $userId]);

            $data = json_decode($request->getContent(), true);
            
            $productId = $data['productId'];

            $product = $productRepository->find($productId);

            if (!$product) {
                return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $wishlistItem = new Wishlist();
            $wishlistItem->setUser($user);
            $wishlistItem->setProduct($product);

            $entityManager->persist($wishlistItem);
            $entityManager->flush();

            return new JsonResponse(['message' => 'Product added to wishlist'], JsonResponse::HTTP_CREATED);
        }

    /**
     * @Route("/wishlist/{id}", name="wishlist_remove", methods={"DELETE"})
     */
    public function removeFromWishlist(
        int $id,
        WishlistRepository $wishlistRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $wishlistItem = $wishlistRepository->find($id);

        if (!$wishlistItem) {
            return new JsonResponse(['error' => 'Wishlist item not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($wishlistItem);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Product removed from wishlist']);
    }

/**
 * @Route("/wishlist", name="wishlist", methods={"GET"})
 */
public function getWishlist(Request $request, 
    WishlistRepository $wishlistRepository, 
    JWTEncoderInterface $jwtEncoder,
    UserRepository $userRepository): JsonResponse {
    $authHeader = $request->headers->get('Authorization');
    $authToken = str_replace('Bearer ', '', $authHeader);
    $decodedJwtToken = $jwtEncoder->decode($authToken);
    $userId = $decodedJwtToken['id'];
    $user = $userRepository->findOneBy(['id' => $userId]);

    

    $wishlistItems = $wishlistRepository->findBy(['user' => $user]);
    // $product = $productRepository->findOneBy(['id' => $wishList]);
    $products = $wishlistItems->getProduct();
    dd($products);
    $genres = $product->getGenre();
    $genreArray =[];
    $productArray = [];
    $wishlistArray = [];

    foreach($genres as $genre){
        $genresArray[] = [
            'name' => $genre->getName(),
        ];
    }
    foreach($products as $product) {
        $productArray[]=[
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
    }
    foreach($wishlistItems as $item) {
        $wishlistArray[]= [
            "id" => $item->getProduct()->getId(),
            "name" => $item->getProduct()->getName(),
            "product" => $productArray
        ];
    }
    return new JsonResponse($wishlistArray, 200);
}
}
