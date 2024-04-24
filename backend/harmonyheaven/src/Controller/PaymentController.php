<?php

namespace App\Controller;

use App\Repository\CommandRepository;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class PaymentController extends AbstractController
{
    /**
     * @Route("/pay", name="pay", methods={"POST"})
     */
    public function pay(Request $request, JWTEncoderInterface $jwtEncoder, UserRepository $userRepository): JsonResponse
    {
        // Récupérez le montant total depuis le corps de la requête POST
        $data = json_decode($request->getContent(), true);

        // Récupérer l'User connecté
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);
        
        // Récupérez cartData du corps de la requête POST
        $totalPrice = $data['amount'];

        // Configurez votre clé secrète Stripe
        $stripeSecretKey = $_ENV['STRIPE_SK'];
        Stripe::setApiKey($stripeSecretKey);

        // Créez une intention de paiement (PaymentIntent)
        $paymentIntent = PaymentIntent::create([
            'amount' => $totalPrice, // Montant en centimes
            'currency' => 'eur', // Devise
        ]);

        // Récupérez le clientSecret de l'intention de paiement
        $clientSecret = $paymentIntent->client_secret;

        // Envoyez le clientSecret au client (par exemple, en tant que réponse JSON)
        return new JsonResponse(['clientSecret' => $clientSecret, 'totalPrice' => $totalPrice]);
    }

    /**
     * @Route("/update-statuts/{idOrder}", name="update-statuts", methods={"POST"})
     */
    public function updateStatuts(Request $request, JWTEncoderInterface $jwtEncoder, UserRepository $userRepository, 
    CommandRepository $commandRepository, $idOrder, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérez le montant total depuis le corps de la requête POST
        $data = json_decode($request->getContent(), true);

        // Récupérer l'User connecté
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        // Récuperer la commande, la livraison et le paiement à update
        $command = $commandRepository->findOneBy(['id' => $idOrder]);
        $delivery = $command->getDelivery();
        $payment = $command->getPayment();

        // Update les statuts
        $command->setStatut(1);
        $delivery->setStatus(1);
        $payment->setStatus(1);
        $entityManager->persist($command);
        $entityManager->persist($delivery);
        $entityManager->persist($payment);
        $entityManager->flush();

        // Envoyez le clientSecret au client (par exemple, en tant que réponse JSON)
        return new JsonResponse(['Statuts mis à jour']);
    }
}
