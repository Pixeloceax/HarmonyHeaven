<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher,
    JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];
        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            $payload = [
                'email'=> $user->getEmail(),
                'id' => $user->getId(),
            ];
            $token = $jwtManager->createFromPayload($user, $payload);
        }

        return new JsonResponse([
            'user' => $token,
        ]);
    }

    /**
     * @Route("/get-current-user", name="get-current-user", methods={"POST"})
     */
    public function getCurrentUser(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $token = $request->headers->get('Authorization');
        $user = $userRepository->findOneBy(['email' => $email]);

        if(!$user || $token === null || !$email || $email == null) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'user'  => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'name'=> $user->getName(),
            'address' => $user->getAddress(),
            'phone' => $user->getPhone(),
        ]);
    }
}
