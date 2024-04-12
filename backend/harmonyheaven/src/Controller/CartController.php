<?php

namespace App\Controller;

use DateTime;
use App\Entity\Cart;
use App\Entity\Command;
use App\Entity\CartItem;
use App\Entity\Delivery;
use App\Entity\CommandItem;
use App\Repository\CartRepository;
use App\Repository\UserRepository;
use App\Entity\DeliveryInformation;
use App\Entity\Payment;
use App\Repository\CommandRepository;
use App\Repository\PaymentRepository;
use App\Repository\ProductRepository;
use App\Repository\CartItemRepository;
use App\Repository\CommandItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

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


/**
 * @Route("/order", name="order", methods={"POST"})
 */
public function order(CartRepository $cartRepository, UserRepository $userRepository, EntityManagerInterface $entityManager,
Request $request, JWTEncoderInterface $jwtEncoder, CommandRepository $commandRepository, CommandItemRepository $commandItemRepository,
): JsonResponse {
    // Récupérer l'User connecté
    $authHeader = $request->headers->get('Authorization');
    $authToken = str_replace('Bearer ', '', $authHeader);
    $decodedJwtToken = $jwtEncoder->decode($authToken);
    $userId = $decodedJwtToken['id'];
    $user = $userRepository->findOneBy(['id' => $userId]);

    // Vérifier si l'utilisateur possède déjà un panier
    $existingCart = $cartRepository->findOneBy(['user' => $user]);

    // Si l'utilisateur n'a pas de panier, retourner une erreur
    if (!$existingCart) {
        return new JsonResponse(['message' => 'Votre panier est vide.'], 400);
    } else {
        //Vérifier si une Commande existe déjà pour l'utilisateur associé.
        $existingCommand = $commandRepository->findOneBy(['user' => $user, 'statut' => 0]);

        // Si la commande n'existe pas, on en crée une nouvelle
        if (!$existingCommand) {
            $this->createNewCommand($user, $existingCart, $entityManager);
        // Si une commande existe 
        } elseif ($existingCommand) {
            $this->updateExistingCommand($user, $existingCommand, $existingCart, $commandItemRepository, $entityManager);
        }
    }

    return new JsonResponse(['message' => 'Commande enregistrée avec succès.'], 200);
}

private function createNewCommand($user, $existingCart, $entityManager)
{
    // Livraison
    $delivery = $this->createDelivery($user, $entityManager);

    // Main Command entity
    $command = new Command();
    $cartItems = $existingCart->getCartItem();
    foreach ($cartItems as $item) {
        $commandItem = $this->createCommandItem($item, $command, $entityManager);
    }
    $command->setStatut(0);

    $payment = $this->createPayment($entityManager);
    $command->setStatut(0);
    $command->setPayment($payment);
    $command->setDelivery($delivery);
    $command->setUser($user);
    $entityManager->persist($command);
    $entityManager->flush();
}

private function updateExistingCommand($user, $existingCommand, $existingCart, $commandItemRepository, $entityManager)
{
    $delivery = $this->createDelivery($user, $entityManager);

    // Main Command entity
    $command = $existingCommand;
    $cartItems = $existingCart->getCartItem();
    foreach ($cartItems as $item) {
        $existingCommandItem = $commandItemRepository->findOneBy(['product' => $item->getProduct(), 'command' => $existingCommand]);
        if ($existingCommandItem) {
            $existingCommandItem->setQuantity($existingCommandItem->getQuantity() + $item->getQuantity());
        } else {
            $commandItem = $this->createCommandItem($item, $command, $entityManager);
        }
    }

    $command->setStatut(0);
    $payment = $this->createPayment($entityManager);
    $command->setStatut(0);
    $command->setPayment($payment);
    $command->setDelivery($delivery);
    $command->setUser($user);
    $entityManager->persist($command);
    $entityManager->flush();
}

private function createDelivery($user, $entityManager)
{
    $delivery = new Delivery();
    $delivery->setAddress($user->getAddress());
    $delivery->setStatus(0);
    $delivery->setDeliveryDate(new DateTime());
    $delivery->setDeliveryCost(100);
    $delivery->setTrackingDetails('jhjhhhbdj');
    $entityManager->persist($delivery);
    return $delivery;
}

private function createCommandItem($item, $command, $entityManager)
{
    $commandItem = new CommandItem();
    $commandItem->setProduct($item->getProduct());
    $commandItem->setQuantity($item->getQuantity());
    $command->addCommandItem($commandItem);
    $entityManager->persist($commandItem);
    return $commandItem;
}

private function createPayment($entityManager)
{
    $payment = new Payment();
    $payment->setStatus(0);
    $payment->setAmountPaid(100);
    $payment->setMethod('Credit card');
    $entityManager->persist($payment);
    return $payment;
}

/**
 * @Route("/get-order", name="get-order", methods={"GET"})
 */
public function getOrder(UserRepository $userRepository, Request $request, JWTEncoderInterface $jwtEncoder, 
CommandRepository $commandRepository): JsonResponse {
    // Récupérer l'User connecté
    $authHeader = $request->headers->get('Authorization');
    $authToken = str_replace('Bearer ', '', $authHeader);
    $decodedJwtToken = $jwtEncoder->decode($authToken);
    $userId = $decodedJwtToken['id'];
    $user = $userRepository->findOneBy(['id' => $userId]);
    $orderArray = [];

    // Vérifier si l'utilisateur possède déjà une commande
    $existingOrder = $commandRepository->findOneBy(['user' => $user]);

    // Si l'utilisateur n'a pas de panier, retourner une erreur
    if (!$existingOrder) {
        return new JsonResponse(['message' => 'Vous n\'avez pas de commande en cours.'], 400);
    } else {
        foreach($existingOrder->getCommandItem() as $item) {
            $orderArray[] = [
                'id'=>$item->getProduct()->getId(),
                'product'=>$item->getProduct()->getName(),
                'img'=>$item->getProduct()->getImage(),
                'quantity'=>$item->getQuantity(),
                'price'=>$item->getProduct()->getPrice(),
            ];
        }
    }

    // Vérifier si l'utilisateur a une adresse associée à son compte
    $address = $user->getAddress();
    if ($address) {
        // Ajouter l'adresse à la réponse
        $response = ['order' => $orderArray, 'address' => $address];
    } else {
        // Retourner seulement la commande dans la réponse
        $response = ['order' => $orderArray];
    }
    return new JsonResponse($response, 200);
}
}
