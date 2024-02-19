<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;


class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Missing email or password'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];
        $password = $data['password'];
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['error' => 'Invalid password or email'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid password or email'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $payload = [
            'email' => $user->getEmail(),
            'id' => $user->getId(),
        ];
        $token = $jwtManager->createFromPayload($user, $payload);

        return new JsonResponse([
            'user' => $token,
        ]);
    }

    /**
     * @Route("/get-current-user", name="get-current-user", methods={"GET"})
     */
    public function getCurrentUser(
        Request $request,
        UserRepository $userRepository,
        JWTTokenManagerInterface $jwtManager,
        JWTEncoderInterface $jwtEncoder,
    ): JsonResponse {

        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);

        $userId = $decodedJwtToken['id'];

        $user = $userRepository->findOneBy(['id' => $userId]);


        if (!$user || $authHeader === null || !$userId || $userId == null) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'user' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'name' => $user->getName(),
            'address' => $user->getAddress(),
            'phone' => $user->getPhone(),
        ]);
    }
}