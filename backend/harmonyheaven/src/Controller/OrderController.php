<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    /**
     * @Route("/order-historic", name="order-historic", methods={"GET"})
     */
    public function orderHistoric(UserRepository $userRepository, Request $request, JWTEncoderInterface $jwtEncoder): JsonResponse
    {
        // Récupérer l'User connecté
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        $ordersArray = [];

        // Filtrer les commandes par statut
        foreach($user->getCommands()->filter(function ($order) {
            return in_array($order->getStatut(), [1, 2]);
        }) as $order) {
            $orderDetailsArray = [];
            $totalPrice = 0;
            foreach($order->getCommandItem() as $orderDetail) {
                $orderDetailsArray[] = [
                    'product' => $orderDetail->getProduct()->getName(),
                    'img'=> $orderDetail->getProduct()->getImage(),
                    'quantity'=> $orderDetail->getQuantity(),
                    'price'=> $orderDetail->getQuantity() * $orderDetail->getProduct()->getPrice(),
                ];
                $totalPrice += $orderDetail->getQuantity() * $orderDetail->getProduct()->getPrice();
            }

            $ordersArray[] = [
                'id' => $order->getId(),
                'status' => $order->getStatut(),
                'tracking-details' => $order->getDelivery()->getTrackingDetails(),
                'order-detail' => $orderDetailsArray,
                'total' => $totalPrice,
                'delivery-date' => $order->getDelivery()->getDeliveryDate(),
            ];
        }

        return new JsonResponse($ordersArray, 200);
    }
}
