<?php

namespace App\Controller;

use App\Repository\WishlistItemRepository;
use App\Repository\WishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use App\Repository\UserRepository;
use App\Entity\Wishlist;
use App\Entity\WishlistItem;
use App\Repository\ProductRepository;

class WishlistController extends AbstractController
{
    /**
     * @Route("/wishlist", name="wishlist_add", methods={"POST"})
     */
    public function addToWishlist(
        Request $request,
        UserRepository $userRepository,
        WishlistRepository $wishlistRepository,
        WishlistItemRepository $wishlistItemRepository,
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        JWTEncoderInterface $jwtEncoder
    ): JsonResponse {
        // Get the authenticated user
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Check if the user already has a wishlist
        $existingWishlist = $wishlistRepository->findOneBy(['user' => $user]);
        $itemData = json_decode($request->getContent(), true);

        // If the user doesn't have a wishlist, create a new one
        if (!$existingWishlist) {
            $wishlist = new Wishlist();
            $wishlist->setUser($user);
            $entityManager->persist($wishlist);
        } else {
            $wishlist = $existingWishlist;
        }

        // Get wishlist item data from the request
        $wishlistItemData = json_decode($request->getContent(), true);

        // Find or create wishlist items
        foreach ($wishlistItemData as $wishlistItemData) {
            // Check if 'productId' key exists
            if (!isset($itemData['productId'])) {
                return new JsonResponse(['error' => 'Missing productId key'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $product = $productRepository->find($itemData['productId']);
            if (!$product) {
                return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $existingWishlistItem = $wishlistItemRepository->findOneBy(['wishlist' => $wishlist, 'product' => $product]);

            // If the product already exists in the wishlist, do nothing
            if ($existingWishlistItem) {
                continue;
            }

            $wishlistItem = new WishlistItem();
            $wishlistItem->setProduct($product);
            $wishlistItem->setWishlist($wishlist);
            $wishlist->addWishlistItem($wishlistItem);
            $entityManager->persist($wishlistItem);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Product added to wishlist successfully'], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/wishlist/{productId}", name="wishlist_remove", methods={"DELETE"})
     */
    public function removeFromWishlist(
        string $productId,
        Request $request,
        UserRepository $userRepository,
        WishlistRepository $wishlistRepository,
        WishlistItemRepository $wishlistItemRepository,
        EntityManagerInterface $entityManager,
        JWTEncoderInterface $jwtEncoder,
        ProductRepository $productRepository // Inject the ProductRepository here
    ): JsonResponse {
        // Get the authenticated user
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Find the user's wishlist
        $wishlist = $wishlistRepository->findOneBy(['user' => $user]);

        if (!$wishlist) {
            return new JsonResponse(['error' => 'Wishlist not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Find the wishlist item to remove
        $product = $productRepository->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $wishlistItem = $wishlistItemRepository->findOneBy(['wishlist' => $wishlist, 'product' => $product]);

        if (!$wishlistItem) {
            return new JsonResponse(['error' => 'Product not found in wishlist'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($wishlistItem);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Product removed from wishlist successfully'], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/get_wishlist  ", name="get_wishlist", methods={"GET"})
     */
    public function getWishlist(
        Request $request,
        UserRepository $userRepository,
        WishlistRepository $wishlistRepository,
        WishlistItemRepository $wishlistItemRepository,
        JWTEncoderInterface $jwtEncoder,
    ): JsonResponse {
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        $wishlist = $wishlistRepository->findOneBy(['user' => $user]);
        if (!$wishlist) {
            // Handle case where no wishlist is found for the user
            return new JsonResponse(['error' => 'Wishlist not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $wishlistItems = $wishlistItemRepository->findBy(['wishlist' => $wishlist]);
        $wishlistArray = [];
        foreach ($wishlistItems as $wishlistItem) {
            $product = $wishlistItem->getProduct();
            $wishlistArray[] = [
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'image' => $product->getImage(),
                'artist' => $product->getArtist()
            ];
        }
        

        return new JsonResponse($wishlistArray);
    }
}