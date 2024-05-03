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
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


class CartController extends AbstractController
{

    /**
     * @Route("/add-to-cart", name="add-to-cart", methods={"POST"})
     */
    public function addToCart(
        Request $request,
        UserRepository $userRepository,
        ProductRepository $productRepository,
        CartRepository $cartRepository,
        EntityManagerInterface $entityManager,
        JWTEncoderInterface $jwtEncoder
    ): JsonResponse {
        // Get the authenticated user
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Get product data from the request
        $requestData = json_decode($request->getContent(), true);
        $productId = $requestData['productId']; // Access productId from the request data

        // Find or create a cart for the user
        $cart = $cartRepository->findOneBy(['user' => $user]);
        if (!$cart) {
            $cart = new Cart();
            $cart->setUser($user);
            $entityManager->persist($cart);
        }

        // Get existing cart items
        $cartItems = $cart->getCartItem();

        // Find or create cart item
        $product = $productRepository->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Check if the product already exists in the cart
        $existingCartItem = null;
        foreach ($cartItems as $item) {
            if ($item->getProduct() === $product) {
                $existingCartItem = $item;
                break;
            }
        }

        // If the product already exists in the cart, increase quantity
        if ($existingCartItem) {
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + 1);
            $product->setQuantity($product->getQuantity() - 1);
        } else {
            // Create a new cart item
            $cartItem = new CartItem();
            $cartItem->setProduct($product);
            $cartItem->setCart($cart);
            $cartItem->setQuantity(1);
            $entityManager->persist($cartItem);
            $product->setQuantity($product->getQuantity() - 1);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Product added to cart successfully'], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/update-stock", name="update-stock", methods={"POST"})
     */
    public function updateStock(
        Request $request,
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $productId = $data['productId'];
        $oldQuantity = $data['oldQuantity'];
        $newQuantity = $data['newQuantity'];

        $product = $productRepository->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        //Si la nouvelle quantité est > à l'ancienne
        if ($newQuantity > $oldQuantity) {
            //On calcule la différence
            $difference = ($newQuantity - $oldQuantity);
            //On décrémente le stock en BDD
            $product->setQuantity($product->getQuantity() - $difference);
            $entityManager->persist($product);
        }

        //Si la nouvelle quantité est < à l'ancienne
        if ($newQuantity < $oldQuantity) {
            //On calcule la différence
            $difference = ($oldQuantity - $newQuantity);
            //On incrémente le stock en BDD
            $product->setQuantity($product->getQuantity() + $difference);
            $entityManager->persist($product);
        }
        $entityManager->flush();

        return new JsonResponse(['message' => 'Stock updated successfully']);
    }


    /**
     * @Route("/update-cart-item/{productId}", name="update-cart-item", methods={"PUT"})
     */
    public function updateCartItem(
        Request $request,
        UserRepository $userRepository,
        ProductRepository $productRepository,
        CartRepository $cartRepository,
        EntityManagerInterface $entityManager,
        JWTEncoderInterface $jwtEncoder,
        int $productId
    ): JsonResponse {
        // Get the authenticated user
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Get the product and cart
        $product = $productRepository->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $cart = $cartRepository->findOneBy(['user' => $user]);

        // Get the new quantity from the request
        $requestData = json_decode($request->getContent(), true);
        $newQuantity = $requestData['quantity'];

        // Find the cart item for the product
        $cartItems = $cart->getCartItem();
        $cartItem = null;
        foreach ($cartItems as $item) {
            if ($item->getProduct() === $product) {
                $cartItem = $item;
                break;
            }
        }

        // If the cart item exists, update the quantity
        if ($cartItem) {
            $cartItem->setQuantity($newQuantity);
        } else {
            return new JsonResponse(['error' => 'Product not found in cart'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->flush();
        return new JsonResponse(['message' => 'Cart item updated successfully'], JsonResponse::HTTP_OK);
    }


    /**
     * @Route("/remove-from-cart/{productId}", name="remove-from-cart", methods={"DELETE"})
     */
    public function removeFromCart(
        string $productId,
        Request $request,
        UserRepository $userRepository,
        CartRepository $cartRepository,
        CartItemRepository $cartItemRepository,
        EntityManagerInterface $entityManager,
        JWTEncoderInterface $jwtEncoder,
        ProductRepository $productRepository,
        TokenStorageInterface $tokenStorage
    ): JsonResponse {
        // Get the authenticated user
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);
        // Find the user's cart
        $cart = $cartRepository->findOneBy(['user' => $user]);

        if (!$cart) {
            return new JsonResponse(['error' => 'Cart not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Find the product to remove
        $product = $productRepository->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $cartItem = $cartItemRepository->findOneBy(['cart' => $cart, 'product' => $productId]);

        if (!$cartItem) {
            return new JsonResponse(['error' => 'Product not found in cart'], JsonResponse::HTTP_NOT_FOUND);
        }

        $productId = $product->getId(); // Get the product ID
        $entityManager->remove($cartItem);
        $entityManager->flush();

        // Increment the product's stock
        $product->setQuantity($product->getQuantity() + $cartItem->getQuantity());
        $entityManager->persist($product);
        $entityManager->flush();

        // Return a success message along with the product ID
        return new JsonResponse(['message' => 'Product removed from cart successfully', 'productId' => $productId], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/submit-cart", name="submit-cart", methods={"POST"})
     */
    public function submitCart(
        CartRepository $cartRepository,
        CartItemRepository $cartItemRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        ProductRepository $productRepository
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
            $product = $productRepository->find($itemData['id']);
            $existingCartItem = $cartItemRepository->findOneBy(['cart' => $cart, 'product' => $product]);

            // If the product exists already in the cart, update the quantity
            if ($existingCartItem) {
                $existingCartItem->setQuantity($existingCartItem->getQuantity() + $itemData['quantity']);
                $entityManager->persist($existingCartItem);

                // If the product does not exist in the cart, add a new cart item
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
     * @Route("/get-cart", name="get-cart", methods={"GET"})
     */
    public function getCart(
        CartRepository $cartRepository,
        CartItemRepository $cartItemRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        ProductRepository $productRepository
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

        // Récupérer les éléments du panier
        $cartItems = $cart->getCartItem();

        // Récupérer les informations sur les produits de chaque élément du panier
        $products = [];
        foreach ($cartItems as $cartItem) {
            $product = $productRepository->find($cartItem->getProduct()->getId());
            $products[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'quantity' => $cartItem->getQuantity(),
                'image' => $product->getImage(),
            ];
        }
        return new JsonResponse(['cart' => $products], 200);
    }


    /**
     * @Route("/order", name="order", methods={"POST"})
     */
    public function order(
        CartRepository $cartRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        CommandRepository $commandRepository,
        CommandItemRepository $commandItemRepository,
    ): JsonResponse {
        // Récupérer l'User connecté
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Vérifier si l'utilisateur possède déjà un panier
        $existingCart = $cartRepository->findOneBy(['user' => $user]);
        $data = json_decode($request->getContent(), true);
        $totalAmount = $data['totalPrice'];

        // Si l'utilisateur n'a pas de panier, retourner une erreur
        if (!$existingCart) {
            return new JsonResponse(['message' => 'Votre panier est vide.'], 400);
        } else {
            //Vérifier si une Commande existe déjà pour l'utilisateur associé.
            $existingCommand = $commandRepository->findOneBy(['user' => $user, 'statut' => 0]);

            // Si la commande n'existe pas, on en crée une nouvelle
            if (!$existingCommand) {
                $this->createNewCommand($user, $existingCart, $entityManager, $totalAmount);
                // Si une commande existe 
            } elseif ($existingCommand) {
                $this->updateExistingCommand($user, $existingCommand, $existingCart, $commandItemRepository, $entityManager, $totalAmount);
            }
        }

        // Récupérer tous les cartItems du panier
        $cartItems = $existingCart->getCartItem();

        // Parcourir chaque cartItem et le supprimer
        foreach ($cartItems as $cartItem) {
            $entityManager->remove($cartItem);
        }

        // Valider les modifications
        $entityManager->flush();

        return new JsonResponse(['message' => 'Commande enregistrée avec succès.'], 200);
    }

    /**
     * @Route("/increment-stock", name="increment-stock", methods={"POST"})
     */
    public function incrementStock(
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $productId = $data['product']['id'];
        $quantity = $data['product']['quantity'];
        $product = $productRepository->findOneBy(['id' => $productId]);
        $product->setQuantity($product->getQuantity() + $quantity);
        $entityManager->persist($product);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Stock mis à jour.'], 200);
    }

    /**
     * @Route("/decrement-stock", name="decrement-stock", methods={"POST"})
     */
    public function decrementStock(
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);
        $productId = $data['product']['id'];
        $product = $productRepository->findOneBy(['id' => $productId]);
        $product->setQuantity($product->getQuantity() - 1);
        $entityManager->persist($product);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Stock mis à jour.'], 200);
    }

    private function createNewCommand($user, $existingCart, $entityManager, $totalAmount)
    {
        // Livraison
        $delivery = $this->createDelivery($user, $entityManager, $totalAmount);

        // Main Command entity
        $command = new Command();
        $cartItems = $existingCart->getCartItem();
        foreach ($cartItems as $item) {
            $commandItem = $this->createCommandItem($item, $command, $entityManager);
        }
        $command->setStatut(0);

        $payment = $this->createPayment($entityManager, $totalAmount);
        $command->setStatut(0);
        $command->setPayment($payment);
        $command->setDelivery($delivery);
        $command->setUser($user);
        $entityManager->persist($command);
        $entityManager->flush();
    }

    private function updateExistingCommand($user, $existingCommand, $existingCart, $commandItemRepository, $entityManager, $totalAmount)
    {

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

        //Récupérer paiement déjà existant
        $payment = $command->getPayment();
        // Récuperer la somme de ce paiement
        $amountPayment = $payment->getAmountPaid();
        // Ajouter la somme du cart à la somme déjà existante
        $payment = $payment->setAmountPaid($amountPayment + $totalAmount);

        //Récupérer livraison déjà existante
        $delivery = $command->getDelivery();
        // Récuperer la somme de cette livraison
        $amountDelivery = $delivery->getDeliveryCost();
        // Ajouter la somme du cart à la somme déjà existante
        $delivery = $delivery->setDeliveryCost($amountDelivery + $totalAmount);

        $command->setStatut(0);
        $command->setPayment($payment);
        $command->setDelivery($delivery);
        $command->setUser($user);
        $entityManager->persist($command);
        $entityManager->flush();
    }

    private function createPayment($entityManager, $totalAmount)
    {
        $payment = new Payment();
        $payment->setStatus(0);
        $payment->setAmountPaid($totalAmount);
        $payment->setMethod('Credit card');
        $entityManager->persist($payment);
        return $payment;
    }

    /**
     * @Route("/get-order", name="get-order", methods={"GET"})
     */
    public function getOrder(
        UserRepository $userRepository,
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        CommandRepository $commandRepository
    ): JsonResponse {
        // Récupérer l'User connecté
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);
        $orderArray = [];

        // Vérifier si l'utilisateur possède déjà une commande
        $existingOrder = $commandRepository->findOneBy(['user' => $user, 'statut' => 0]);

        // Si l'utilisateur n'a pas de panier, retourner une erreur
        if (!$existingOrder) {
            return new JsonResponse(['message' => 'Vous n\'avez pas de commande en cours.'], 400);
        } else {
            foreach ($existingOrder->getCommandItem() as $item) {
                $orderArray[] = [
                    'id' => $item->getProduct()->getId(),
                    'product' => $item->getProduct()->getName(),
                    'img' => $item->getProduct()->getImage(),
                    'quantity' => $item->getQuantity(),
                    'price' => $item->getProduct()->getPrice(),
                ];
            }
        }

        // Vérifier si l'utilisateur a une adresse associée à son compte
        $address = $user->getAddress();
        if ($address) {
            // Ajouter l'adresse à la réponse
            $response = ['order' => $orderArray, 'address' => $address, 'statut' => $existingOrder->getStatut(), 'idOrder' => $existingOrder->getId()];
        } else {
            // Retourner seulement la commande dans la réponse
            $response = ['order' => $orderArray, 'statut' => $existingOrder->getStatut(), 'idOrder' => $existingOrder->getId()];
        }
        return new JsonResponse($response, 200);
    }

    private function createDelivery($user, $entityManager, $totalAmount)
    {
        $delivery = new Delivery();
        $delivery->setAddress($user->getAddress());
        $delivery->setStatus(0);
        $delivery->setDeliveryDate(new DateTime());
        $delivery->setDeliveryCost($totalAmount);
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

}
