<?php

namespace App\Controller;

use App\Repository\CartItemRepository;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserRepository;
use App\Entity\Cart;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use App\Repository\ProductRepository;
use App\Entity\CartItem;

class CartController extends AbstractController
{
    /**
 * @Route("/cart", name="cart", methods={"POST"})
 */
public function submitCart(
CartRepository $cartRepository, CartItemRepository $cartItemRepository, UserRepository $userRepository,
EntityManagerInterface $entityManager, Request $request, JWTEncoderInterface $jwtEncoder, ProductRepository $productRepository
): JsonResponse {
    // Récuperer l'User connecté
    $authHeader = $request->headers->get('Authorization');
    $authToken = str_replace('Bearer ', '', $authHeader);
    $decodedJwtToken = $jwtEncoder->decode($authToken);
    $userId = $decodedJwtToken['id'];
    $user = $userRepository->findOneBy(['id' => $userId]);

    // Vérifier si l'utilisateur possède déjà un panier
    $existingCart = $cartRepository->findOneBy(['user' => $user]);

    // Si l'utilisateur n'a pas de panier, créez-en un nouveau
    if (!$existingCart) {
        $cart = new Cart();
        $cart->setUser($user);
        $entityManager->persist($cart);
    // Utiliser le panier existant
    } else {
        $cart = $existingCart;
    }

    // Récuperer le panier dans la requête
    $cartItemsData = json_decode($request->getContent(), true);

    foreach ($cartItemsData as $itemData) {
        $product = $productRepository->find($itemData['productId']);
        $existingCartItem = $cartItemRepository->findOneBy(['cart' => $cart, 'product' => $product]);

        // Si le produit existe déjà dans le panier, mettez à jour la quantité
        if ($existingCartItem) {
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + $itemData['quantity']);
            $entityManager->persist($existingCartItem);

        // Si le produit n'existe pas dans le panier, ajoutez un nouvel élément de panier
        } else {
            $cartItem = new CartItem();
            $cartItem->setProduct($product);
            $cartItem->setQuantity($itemData['quantity']);
            $cartItem->setCart($cart);
            $cart->addCartItem($cartItem);
            $entityManager->persist($cartItem);
        }
    }
    $entityManager->flush();
    return new JsonResponse($cart, 200);
}

}
