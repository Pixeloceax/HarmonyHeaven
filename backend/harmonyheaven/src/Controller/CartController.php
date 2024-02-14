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
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
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
        CartRepository $cartRepository,
        CartItemRepository $cartItemRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWTTokenManagerInterface $jwtManager,
        JWTEncoderInterface $jwtEncoder,
        ProductRepository $productRepository
    ): JsonResponse {
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);

        $userId = $decodedJwtToken['id'];

        $cart = new Cart();
        $user = $userRepository->findOneBy(['id' => $userId]);
        $cart->setUser($user);


        $cartItemsData = json_decode($request->getContent(), true);

        foreach ($cartItemsData as $itemData) {
            $product = $productRepository->find($itemData['productId']);
            $cartItem = new CartItem();
            $cartItem->setProduct($product);
            $cartItem->setQuantity($itemData['quantity']);
            $cart->addCartItem($cartItem);
        }

        $entityManager->persist($cart);
        $entityManager->flush();

        return new JsonResponse($cart, 200);
    }
}
